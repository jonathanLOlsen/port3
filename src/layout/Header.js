import React from 'react';
import { Link } from 'react-router-dom'; // Use Link from react-router-dom for navigation

const Header = () => {
  return (
    <header className="header" style={{ padding: "10px", background: "#f4f4f4" }}>
      <h1>Welcome to the Home Page</h1>
      <nav style={{ display: "flex", gap: "20px" }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/movies">Movies</Link> {/* Add Movies link */}
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
};

export default Header;
