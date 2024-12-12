import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/profile');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        try {
            const response = await fetch('http://localhost:7247/api/Users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Login failed');
            }
    
            const userData = await response.json();
            console.log('Login successful, userData:', userData); // Debug log
    
            // Call login with token, username, userId, and email
            login(userData.token, userData.username, userData.userId, userData.email);
            navigate('/profile', { replace: true });
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
        }
    };
    

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Login</button>

                {/* Register Button */}
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={() => navigate('/register')}>
                        Don't have an account? Register
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
           

                
           