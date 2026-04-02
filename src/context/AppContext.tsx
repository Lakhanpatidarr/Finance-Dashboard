import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
type UserRole = 'viewer' | 'admin';
type Theme = 'light' | 'dark';
interface AppContextType {
    role: UserRole;
    setRole: (role: UserRole) => void;
    theme: Theme;
    toggleTheme: () => void;
}
const AppContext = createContext<AppContextType | undefined>(undefined);
export function AppProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<UserRole>(() => {
        const saved = localStorage.getItem('userRole');
        return (saved === 'admin' || saved === 'viewer') ? saved : 'viewer';
    });
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme');
        return (saved === 'dark' || saved === 'light') ? saved : 'light';
    });
    useEffect(() => {
        localStorage.setItem('userRole', role);
    }, [role]);
    useEffect(() => {
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };
    return (
        <AppContext.Provider value={{ role, setRole, theme, toggleTheme }}>
            {children}
        </AppContext.Provider>
    );
}
export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}