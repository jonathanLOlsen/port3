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
            const response = await fetch('http://localhost:5255/api/Users/login', {
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

            const data = await response.json();
            alert(data.Message); // Login successful
            navigate('/dashboard'); // Redirect to dashboard on successful login

        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
        }
    };

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
            </form>
        </div>
    )
}

export default Login;