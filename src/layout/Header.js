import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <Link to="/" className="navbar-brand">
          MovieApp
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/movies" className="nav-link">
                Movies
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/people" className="nav-link">
                People
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <div className="dropdown" ref={dropdownRef}>
                <button
                  className="btn btn-outline-light dropdown-toggle"
                  onClick={toggleDropdown}
                >
                  {username || "Profile"}
                </button>
                {showDropdown && (
                  <ul className="dropdown-menu dropdown-menu-end show">
                    <li>
                      <Link to="/profile" className="dropdown-item">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/bookmarks" className="dropdown-item">
                        Bookmarks
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline-light">
                Log In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
