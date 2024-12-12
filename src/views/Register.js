import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () =>{
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        try{
            const response = await fetch('http://localhost:7247/api/Users',{
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    email,
                    username,
                    password,
                }),
            });
        
            if (!response.ok){
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Registration failed')
            }

            alert('Registration successful! Please log in.');
            navigate('/login');
        }catch(err){
            console.error('Registration error:', err);
            setError(err.message);
        }
    }
    
    return(
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />    
                </div>
                <div>
                <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />  
                </div>
                <div>
                <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />  
                </div>
                {error && <p classname = "error">{error}</p>}
                <button type="submit">Register</button>

                {/* login Button */}
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={() => navigate('/login')}>
                        Already have an account? Login
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Register;