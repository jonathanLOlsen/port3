import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './Header.css';

const Header = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { isAuthenticated, username, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    

    return (
        <header className="header">
            <nav className="navbar">
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    <Link to="/movies" className="nav-link">Movies</Link>
                    <Link to="/people" className= "nav-link">People</Link>
                    
                </div>

                <div className="profile-section" ref={dropdownRef}>
                    {isAuthenticated ? (
                        <>
                            <button onClick={toggleDropdown} className="nav-button">
                                {username || 'Profile'}
                            </button>
                            {showDropdown && (
                                <div className="dropdown-content">
                                    <Link to="/profile" className="dropdown-item">Profile</Link>
                                    <Link to="/bookmarks" className="dropdown-item">Bookmarks</Link>
                                    
                                </div>
                            )}
                        </>
                    ) : (
                        <Link to="/login" className="nav-link">Log In</Link>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
