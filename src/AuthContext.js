import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(true);

    const setAuthData = ({ token, username, userId, userEmail }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userEmail', userEmail);
    };

    const clearAuthData = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
    };

    const login = (token, username, userId, userEmail) => {
        setAuthData({ token, username, userId, userEmail });
        setIsAuthenticated(true);
        setUsername(username);
        setUserId(userId);
        setUserEmail(userEmail);
    };

    const logout = () => {
        clearAuthData();
        setIsAuthenticated(false);
        setUsername('');
        setUserId(null);
        setUserEmail('');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        const storedUserId = localStorage.getItem('userId');
        const storedUserEmail = localStorage.getItem('userEmail');

        if (token && storedUsername && storedUserId) {
            setIsAuthenticated(true);
            setUsername(storedUsername);
            setUserId(storedUserId);
            setUserEmail(storedUserEmail);
        } else {
            logout();
        }

        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, userId, userEmail, login, logout, loading }}>
            {loading ? <div>Loading authentication...</div> : children}
        </AuthContext.Provider>
    );
};
