import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if token exists when the component mounts
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');

        console.log('AuthContext: Initial token:', token);
        console.log('AuthContext: Initial username:', storedUsername);

        if (token) {
            setIsAuthenticated(true);
            setUsername(storedUsername);
        } else {
            setIsAuthenticated(false);
            setUsername('');
        }

        setLoading(false); // Indicate that loading is complete
    }, []);

    const login = (token, username) => {
        console.log('Login called with:', { token, username }); // Debug log

        localStorage.setItem('token', token);
        localStorage.setItem('username', username);

        setIsAuthenticated(true);
        setUsername(username);

        console.log('Token stored in localStorage:', localStorage.getItem('token'));
        console.log('Username stored in localStorage:', localStorage.getItem('username'));
    };
    
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setUsername('');
        console.log('User logged out'); // Debug log
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
