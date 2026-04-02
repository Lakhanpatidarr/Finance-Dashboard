import { TrendingUp, TrendingDown, AlertCircle, Award } from 'lucide-react';
import { Transaction } from '../lib/supabase';
import { getTopCategory, getMonthlyData, formatCurrency } from '../utils/calculations';

interface InsightsProps {
    transactions: Transaction[];
}
export function Insights({ transactions }: InsightsProps) {
    const monthlyData = getMonthlyData(transactions);
    const topIncome = getTopCategory(transactions, 'income');
    const topExpense = getTopCategory(transactions, 'expense');
    const currentMonth = monthlyData[monthlyData.length - 1];
    const previousMonth = monthlyData[monthlyData.length - 2];
    const insights = [];
    if (topExpense) {
        insights.push({
            icon: TrendingDown,
            title: 'Highest Spending Category',
            value: topExpense.category,
            detail: `${formatCurrency(topExpense.amount)} (${topExpense.percentage.toFixed(1)}% of expenses)`,
            color: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-50 dark:bg-red-900/30'
        });
    }
    if (topIncome) {
        insights.push({
            icon: TrendingUp,
            title: 'Top Income Source',
            value: topIncome.category,
            detail: `${formatCurrency(topIncome.amount)} (${topIncome.percentage.toFixed(1)}% of income)`,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-900/30'
        });
    }
    if (currentMonth && previousMonth) {
        const expenseChange = currentMonth.expenses - previousMonth.expenses;
        const expenseChangePercent = previousMonth.expenses > 0
            ? ((expenseChange / previousMonth.expenses) * 100)
            : 0;
        insights.push({
            icon: expenseChange > 0 ? AlertCircle : Award,
            title: 'Monthly Expense Comparison',
            value: expenseChange > 0 ? 'Increased' : 'Decreased',
            detail: `${Math.abs(expenseChangePercent).toFixed(1)}% ${expenseChange > 0 ? 'more' : 'less'
                } than last month`,
            color: expenseChange > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400',
            bgColor: expenseChange > 0 ? 'bg-orange-50 dark:bg-orange-900/30' : 'bg-blue-50 dark:bg-blue-900/30'
        });
    }
    const avgDailyExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0) / 30;
    if (avgDailyExpense > 0) {
        insights.push({
            icon: TrendingDown,
            title: 'Average Daily Spending',
            value: formatCurrency(avgDailyExpense),
            detail: 'Based on last 30 days of activity',
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-900/30'
        });
    }
    if (insights.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Insights</h3>
                <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                    No insights available yet
                </div>
            </div>
        );
    }
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Financial Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                        <div
                            key={index}
                            className={`${insight.bgColor} rounded-lg p-4 border border-gray-200 dark:border-gray-700`}
                        >
                            <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-lg bg-white dark:bg-gray-800`}>
                                    <Icon className={`w-5 h-5 ${insight.color}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        {insight.title}
                                    </p>
                                    <p className={`text-lg font-bold ${insight.color} mb-1`}>
                                        {insight.value}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {insight.detail}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}