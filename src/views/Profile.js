import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth} from '../AuthContext';

const Profile = () => {
    const { isAuthenticated, username, logout, loading } = useAuth();

    const navigate = useNavigate();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated && !loading) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate, loading]);


    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Hello, {username}</h1>
            <button onClick={() => navigate('/bookmarks')}>View Bookmarks</button>
            <button onClick={handleLogout}>Log out</button>
        </div>
    );
};


export default Profile;
