import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try{
            const response = await fetch('https://localhost:7247/api/Users/login', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({ email, password }),
            });
            

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Login failed');
            }

            const userData = await response.json();

            localStorage.setItem('userEmail', userData.email);
            localStorage.setItem('username', userData.username);

            navigate('/profile');

        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
        }
    }

    return (
        <div classname="login-container"> 
            <h2>Login</h2>
            <form onSubmit = {handleSubmit}>
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
                {error && <p classname = "error">{error}</p>}
                <button type = "submit" >Login</button>
                
                {/* Register Button */}
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={() => navigate('/register')}>
                        Don't have an account? Register
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Login;