import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const stored = localStorage.getItem('studybuddy_user');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed && parsed.id) {
                    setUser(parsed);
                }
            } catch {
                // ignore
            }
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        if (typeof window !== 'undefined') {
            localStorage.setItem('studybuddy_user', JSON.stringify(userData));
        }
    };

    const logout = () => {
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('studybuddy_user');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

