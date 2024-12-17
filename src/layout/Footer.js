import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container text-center">
        <h4 className="mb-3">Site Map</h4>
        <nav>
          <ul className="list-unstyled d-flex justify-content-center flex-wrap mb-0">
            <li className="mx-3">
              <Link to="/" className="text-white text-decoration-none">
                Home
              </Link>
            </li>
            <li className="mx-3">
              <Link to="/movies" className="text-white text-decoration-none">
                Movies
              </Link>
            </li>
            <li className="mx-3">
              <Link to="/people" className="text-white text-decoration-none">
                People
              </Link>
            </li>
            <li className="mx-3">
              <Link to="/about" className="text-white text-decoration-none">
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
