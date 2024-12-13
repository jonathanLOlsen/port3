import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UpdateProfile from './UpdateProfile';
import { useAuth} from '../AuthContext';

const Profile = () => {
    const { isAuthenticated, username, userEmail, logout, loading } = useAuth();

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
            <p>Email: {userEmail}</p>
            <button onClick={() => navigate('/bookmarks')}>View Bookmarks</button>
            <button onClick={handleLogout}>Log out</button>
            
            <h1>Your Profile</h1>
            <UpdateProfile />
        
        </div>
        
    );
};


export default Profile;
