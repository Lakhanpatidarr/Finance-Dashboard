import { CategoryBreakdown, formatCurrency } from '../utils/calculations';
interface CategoryChartProps {
    data: CategoryBreakdown[];
    title: string;
    type: 'income' | 'expense';
}
const COLORS = [
    { bg: 'bg-blue-500', text: 'text-blue-500' },
    { bg: 'bg-green-500', text: 'text-green-500' },
    { bg: 'bg-purple-500', text: 'text-purple-500' },
    { bg: 'bg-orange-500', text: 'text-orange-500' },
    { bg: 'bg-pink-500', text: 'text-pink-500' },
    { bg: 'bg-cyan-500', text: 'text-cyan-500' },
    { bg: 'bg-yellow-500', text: 'text-yellow-500' },
    { bg: 'bg-red-500', text: 'text-red-500' }
];
export function CategoryChart({ data, title, type }: CategoryChartProps) {
    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
                <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    No data available
                </div>
            </div>
        );
    }
    const topCategories = data.slice(0, 5);
    const total = topCategories.reduce((sum, item) => sum + item.amount, 0);
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">{title}</h3>
            <div className="space-y-4">
                {topCategories.map((item, index) => {
                    const color = COLORS[index % COLORS.length];
                    const widthPercent = (item.amount / total) * 100;
                    return (
                        <div key={item.category} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${color.bg}`}></div>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {item.category}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        ({item.count})
                                    </span>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(item.amount)}
                                </span>
                            </div>
                            <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className={`absolute h-full ${color.bg} rounded-full transition-all duration-500`}
                                    style={{ width: `${widthPercent}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>{item.percentage.toFixed(1)}% of total</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            {data.length > 5 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        + {data.length - 5} more categories
                    </p>
                </div>
            )}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total {type === 'income' ? 'Income' : 'Expenses'}
                    </span>
                    <span className={`text-lg font-bold ${type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                        {formatCurrency(data.reduce((sum, item) => sum + item.amount, 0))}
                    </span>
                </div>
            </div>
        </div>
    );
}