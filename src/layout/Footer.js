import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="footer"
      style={{
        backgroundColor: "#343a40",
        color: "white",
        padding: "20px",
        marginTop: "20px",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: "10px" }}>
        <h4>Site Map</h4>
        <nav>
          <ul
            style={{
              listStyleType: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <li style={{ margin: "0 15px" }}>
              <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                Home
              </Link>
            </li>
            <li style={{ margin: "0 15px" }}>
              <Link
                to="/movies"
                style={{ color: "white", textDecoration: "none" }}
              >
                Movies
              </Link>
            </li>
            <li style={{ margin: "0 15px" }}>
              <Link
                to="/people"
                style={{ color: "white", textDecoration: "none" }}
              >
                People
              </Link>
            </li>
            <li style={{ margin: "0 15px" }}>
              <Link
                to="/about"
                style={{ color: "white", textDecoration: "none" }}
              >
                About
              </Link>
            </li>
            {/* Add more links as needed */}
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
