import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Summary, formatCurrency } from '../utils/calculations';

interface SummaryCardsProps {
    summary: Summary;
}



export function SummaryCards({ summary }: SummaryCardsProps) {
    const cards = [
        {
            title: 'Total Balance',
            value: summary.totalBalance,
            icon: Wallet,
            bgColor: 'from-blue-600 to-cyan-500',
            textColor: 'text-blue-600 dark:text-blue-400'
        },
        {
            title: 'Total Income',
            value: summary.totalIncome,
            icon: TrendingUp,
            bgColor: 'from-green-600 to-emerald-500',
            textColor: 'text-green-600 dark:text-green-400'
        },
        {
            title: 'Total Expenses',
            value: summary.totalExpenses,
            icon: TrendingDown,
            bgColor: 'from-red-600 to-pink-500',
            textColor: 'text-red-600 dark:text-red-400'
        }
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    {card.title}
                                </p>
                                <p className={`text-3xl font-bold ${card.textColor} mb-2`}>
                                    {formatCurrency(card.value)}
                                </p>
                                {index === 0 && (
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        {summary.totalBalance >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
                                    </p>
                                )}
                            </div>
                            <div className={`bg-gradient-to-br ${card.bgColor} p-3 rounded-lg`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}