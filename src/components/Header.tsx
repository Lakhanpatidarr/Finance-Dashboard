import { Moon, Sun, Wallet, Shield, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';


export function Header() {
    const { role, setRole, theme, toggleTheme } = useApp();
    return (
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-lg">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Finance Dashboard</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Track your financial journey</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setRole('viewer')}
                                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${role === 'viewer'
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                <Eye className="w-4 h-4" />
                                <span className="hidden sm:inline">Viewer</span>
                            </button>
                            <button
                                onClick={() => setRole('admin')}
                                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${role === 'admin'
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                <Shield className="w-4 h-4" />
                                <span className="hidden sm:inline">Admin</span>
                            </button>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}