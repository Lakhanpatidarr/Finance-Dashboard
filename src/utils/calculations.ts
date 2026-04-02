import { Transaction } from '../lib/supabase';
export interface Summary {
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
}
export interface CategoryBreakdown {
    category: string;
    amount: number;
    percentage: number;
    count: number;
}
export interface MonthlyData {
    month: string;
    income: number;
    expenses: number;
    balance: number;
}
export function calculateSummary(transactions: Transaction[]): Summary {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    return {
        totalBalance: income - expenses,
        totalIncome: income,
        totalExpenses: expenses
    };
}
export function getCategoryBreakdown(transactions: Transaction[], type: 'income' | 'expense'): CategoryBreakdown[] {
    const filtered = transactions.filter(t => t.type === type);
    const total = filtered.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    const categoryMap = new Map<string, { amount: number; count: number }>();

    filtered.forEach(t => {
        const amount = Math.abs(Number(t.amount));
        const existing = categoryMap.get(t.category) || { amount: 0, count: 0 };
        categoryMap.set(t.category, {
            amount: existing.amount + amount,
            count: existing.count + 1
        });
    });
    return Array.from(categoryMap.entries())
        .map(([category, data]) => ({
            category,
            amount: data.amount,
            percentage: total > 0 ? (data.amount / total) * 100 : 0,
            count: data.count
        }))
        .sort((a, b) => b.amount - a.amount);
}
export function getMonthlyData(transactions: Transaction[]): MonthlyData[] {
    const monthMap = new Map<string, { income: number; expenses: number }>();
    transactions.forEach(t => {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const existing = monthMap.get(monthKey) || { income: 0, expenses: 0 };
        if (t.type === 'income') {
            existing.income += Math.abs(Number(t.amount));
        } else {
            existing.expenses += Math.abs(Number(t.amount));
        }
        monthMap.set(monthKey, existing);
    });
    return Array.from(monthMap.entries())
        .map(([month, data]) => ({
            month,
            income: data.income,
            expenses: data.expenses,
            balance: data.income - data.expenses
        }))
        .sort((a, b) => a.month.localeCompare(b.month));
}
export function getTopCategory(transactions: Transaction[], type: 'income' | 'expense'): CategoryBreakdown | null {
    const breakdown = getCategoryBreakdown(transactions, type);
    return breakdown.length > 0 ? breakdown[0] : null;
}
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
}
export function getMonthName(monthKey: string): string {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: 'numeric'
    }).format(date);
}