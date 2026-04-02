import { useState, useMemo } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction } from '../lib/supabase';
import { calculateSummary, getCategoryBreakdown, getMonthlyData } from '../utils/calculations';
import { Header } from './Header';
import { SummaryCards } from './SummaryCards';
import { BalanceTrendChart } from './BalanceTrendChart';
import { CategoryChart } from './CategoryChart';
import { TransactionsList } from './TransactionsList';
import { TransactionForm } from './TransactionForm';
import { Insights } from './Insights';
import { useApp } from '../context/AppContext';

export function Dashboard() {
    const { role } = useApp();
    const { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
    const summary = useMemo(() => calculateSummary(transactions), [transactions]);
    const expenseBreakdown = useMemo(() => getCategoryBreakdown(transactions, 'expense'), [transactions]);
    const incomeBreakdown = useMemo(() => getCategoryBreakdown(transactions, 'income'), [transactions]);
    const monthlyData = useMemo(() => getMonthlyData(transactions), [transactions]);
    const handleAddTransaction = () => {
        setEditingTransaction(undefined);
        setShowForm(true);
    };
    const handleEditTransaction = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setShowForm(true);
    };
    const handleSubmitTransaction = async (data: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
        if (editingTransaction) {
            await updateTransaction(editingTransaction.id, data);
        } else {
            await addTransaction(data);
        }
    };
    const handleDeleteTransaction = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            await deleteTransaction(id);
        }
    };
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading your financial data...</p>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-red-200 dark:border-red-800 max-w-md w-full">
                    <div className="flex items-center space-x-3 mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Error</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {role === 'viewer' && (
                    <div className="mb-6 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            You are in Viewer mode. Switch to Admin mode to add, edit, or delete transactions.
                        </p>
                    </div>
                )}
                <div className="space-y-6">
                    <SummaryCards summary={summary} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <BalanceTrendChart data={monthlyData} />
                        <CategoryChart
                            data={expenseBreakdown}
                            title="Spending Breakdown"
                            type="expense"
                        />
                    </div>
                    <Insights transactions={transactions} />
                    <TransactionsList
                        transactions={transactions}
                        onAdd={handleAddTransaction}
                        onEdit={handleEditTransaction}
                        onDelete={handleDeleteTransaction}
                    />
                </div>
            </main>
            {showForm && (
                <TransactionForm
                    transaction={editingTransaction}
                    onSubmit={handleSubmitTransaction}
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    );
}