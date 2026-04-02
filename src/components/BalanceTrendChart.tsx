import { MonthlyData, getMonthName, formatCurrency } from '../utils/calculations';
interface BalanceTrendChartProps {
    data: MonthlyData[];
}
export function BalanceTrendChart({ data }: BalanceTrendChartProps) {
    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Balance Trend</h3>
                <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    No data available
                </div>
            </div>
        );
    }
    const maxValue = Math.max(...data.map(d => Math.max(d.income, d.expenses)));
    const chartHeight = 200;
    const chartWidth = 100;
    const padding = 20;
    const getY = (value: number) => {
        return chartHeight - (value / maxValue) * (chartHeight - padding);
    };
    const incomePoints = data
        .map((d, i) => `${(i / (data.length - 1)) * chartWidth},${getY(d.income)}`)
        .join(' ');

    const expensePoints = data
        .map((d, i) => `${(i / (data.length - 1)) * chartWidth},${getY(d.expenses)}`)
        .join(' ');

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Balance Trend
            </h3>
            <div className="relative">
                <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-64"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="incomeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <polyline
                        points={`0,${chartHeight} ${incomePoints} ${chartWidth},${chartHeight}`}
                        fill="url(#incomeGradient)"
                    />
                    <polyline
                        points={incomePoints}
                        fill="none"
                        stroke="rgb(34, 197, 94)"
                        strokeWidth="0.5"
                    />
                    <polyline
                        points={`0,${chartHeight} ${expensePoints} ${chartWidth},${chartHeight}`}
                        fill="url(#expenseGradient)"
                    />
                    <polyline
                        points={expensePoints}
                        fill="none"
                        stroke="rgb(239, 68, 68)"
                        strokeWidth="0.5"
                    />
                    {data.map((d, i) => (
                        <g key={i}>
                            <circle
                                cx={(i / (data.length - 1)) * chartWidth}
                                cy={getY(d.income)}
                                r="1"
                                fill="rgb(34, 197, 94)"
                            />
                            <circle
                                cx={(i / (data.length - 1)) * chartWidth}
                                cy={getY(d.expenses)}
                                r="1"
                                fill="rgb(239, 68, 68)"
                            />
                        </g>
                    ))}
                </svg>
                <div className="flex justify-between mt-4 text-xs text-gray-600 dark:text-gray-400">
                    {data.map((d, i) => (
                        <span key={i} className={data.length > 4 ? 'hidden sm:inline' : ''}>
                            {getMonthName(d.month).split(' ')[0]}
                        </span>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-6">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Income</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg Income</p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(data.reduce((sum, d) => sum + d.income, 0) / data.length)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg Expenses</p>
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                        {formatCurrency(data.reduce((sum, d) => sum + d.expenses, 0) / data.length)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg Balance</p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {formatCurrency(data.reduce((sum, d) => sum + d.balance, 0) / data.length)}
                    </p>
                </div>
            </div>
        </div>
    );
}