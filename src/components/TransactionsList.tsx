import { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Plus, CreditCard as Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../lib/supabase';
import { formatCurrency, formatDate } from '../utils/calculations';
import { useApp } from '../context/AppContext';
interface TransactionsListProps {
    transactions: Transaction[];
    onAdd: () => void;
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
}
type SortField = 'date' | 'amount' | 'category';
type SortDirection = 'asc' | 'desc';

export function TransactionsList({ transactions, onAdd, onEdit, onDelete }: TransactionsListProps) {
    const { role } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const filteredAndSortedTransactions = useMemo(() => {
        let filtered = transactions.filter(t => {
            const matchesSearch =
                t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || t.type === filterType;
            return matchesSearch && matchesType;
        });
        filtered.sort((a, b) => {
            let aValue: string | number = a[sortField];
            let bValue: string | number = b[sortField];
            if (sortField === 'amount') {
                aValue = Math.abs(Number(a.amount));
                bValue = Math.abs(Number(b.amount));
            }
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        return filtered;
    }, [transactions, searchTerm, filterType, sortField, sortDirection]);
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Transactions
                    </h3>
                    {role === 'admin' && (
                        <button
                            onClick={onAdd}
                            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Transaction</span>
                        </button>
                    )}
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
                            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Types</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th
                                onClick={() => handleSort('date')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Date</span>
                                    <ArrowUpDown className="w-4 h-4" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Description
                            </th>
                            <th
                                onClick={() => handleSort('category')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Category</span>
                                    <ArrowUpDown className="w-4 h-4" />
                                </div>
                            </th>
                            <th
                                onClick={() => handleSort('amount')}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Amount</span>
                                    <ArrowUpDown className="w-4 h-4" />
                                </div>
                            </th>
                            {role === 'admin' && (
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredAndSortedTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={role === 'admin' ? 5 : 4} className="px-6 py-12 text-center">
                                    <div className="text-gray-500 dark:text-gray-400">
                                        <p className="text-lg font-medium mb-2">No transactions found</p>
                                        <p className="text-sm">Try adjusting your search or filters</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedTransactions.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                        {formatDate(transaction.date)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        <div className="flex items-center space-x-2">
                                            <div className={`p-1.5 rounded-lg ${transaction.type === 'income'
                                                ? 'bg-green-100 dark:bg-green-900/30'
                                                : 'bg-red-100 dark:bg-red-900/30'
                                                }`}>
                                                {transaction.type === 'income' ? (
                                                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                )}
                                            </div>
                                            <span>{transaction.description || 'No description'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                            {transaction.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                        <span className={transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                            {transaction.type === 'income' ? '+' : '-'}
                                            {formatCurrency(Math.abs(Number(transaction.amount)))}
                                        </span>
                                    </td>
                                    {role === 'admin' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => onEdit(transaction)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                    aria-label="Edit transaction"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(transaction.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                    aria-label="Delete transaction"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {filteredAndSortedTransactions.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Showing {filteredAndSortedTransactions.length} of {transactions.length} transactions
                    </p>
                </div>
            )}
        </div>
    );
}