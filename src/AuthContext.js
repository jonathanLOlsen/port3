import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
    const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        const storedUserId = localStorage.getItem('userId');
        const storedUserEmail = localStorage.getItem('userEmail');

        console.log('AuthContext: Initial token:', token);
        console.log('AuthContext: Initial username:', storedUsername);
        console.log('AuthContext: Initial userId:', storedUserId);
        console.log('AuthContext: Initial userEmail:', storedUserEmail);

        if (token) {
            setIsAuthenticated(true);
            setUsername(storedUsername);
            setUserId(storedUserId);
            setUserEmail(storedUserEmail);
        } else {
            setIsAuthenticated(false);
            setUsername('');
            setUserId('');
            setUserEmail('');
        }

        setLoading(false); // Indicate that loading is complete
    }, []);

    const login = (token, username, userId, userEmail) => {
        console.log('Login called with:', { token, username, userId, userEmail }); // Debug log

        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userEmail', userEmail);

        setIsAuthenticated(true);
        setUsername(username);
        setUserId(userId);
        setUserEmail(userEmail);

        console.log('Token stored in localStorage:', localStorage.getItem('token'));
        console.log('Username stored in localStorage:', localStorage.getItem('username'));
        console.log('UserId stored in localStorage:', localStorage.getItem('userId'));
        console.log('UserEmail stored in localStorage:', localStorage.getItem('userEmail'));
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        setIsAuthenticated(false);
        setUsername('');
        setUserId('');
        setUserEmail('');
        console.log('User logged out'); // Debug log
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, username, userId, userEmail, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
