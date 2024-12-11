import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();

    // Retrieve email from localStorage
    const email = localStorage.getItem('userEmail');
    const username = localStorage.getItem('username');

    // Redirect to login if email is not available
    useEffect(() => {
    
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <div>
            <h1>Hello, {username}</h1>
            <button onClick={handleLogout}>Log out</button>
        </div>
    );
};


export default Profile;
