import 'bootstrap/dist/css/bootstrap.min.css';


import React from "react";
import { useLocation, Link } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();

  // Split the pathname into segments, excluding the empty string at the start
  const paths = location.pathname.split("/").filter((path) => path);

  return (
    <nav aria-label="breadcrumb" className="m-0">
      <ol
        className="breadcrumb p-2 m-0 d-flex align-items-center"
        style={{
          backgroundColor: "#343a40", // Dark gray background
          color: "white", // White text
          borderRadius: 0, // Remove border rounding
        }}
      >
        {/* Home breadcrumb */}
        <li className="breadcrumb-item">
          <Link to="/" className="text-white">
            <i className="bi bi-house-door-fill"></i> Home
          </Link>
        </li>
        {/* Dynamically generated breadcrumbs */}
        {paths.map((path, index) => {
          const fullPath = `/${paths.slice(0, index + 1).join("/")}`;
          const isLast = index === paths.length - 1; // Check if it's the last breadcrumb
          return (
            <React.Fragment key={index}>
              {/* Custom White Separator */}
              <span className="text-white mx-1">/</span>
              <li
                className={`breadcrumb-item ${isLast ? "active" : ""}`}
                aria-current={isLast ? "page" : undefined}
              >
                {isLast ? (
                  // If last breadcrumb, render text without link
                  <span className="text-light">{path.replace(/-/g, " ")}</span>
                ) : (
                  // Else render as a link
                  <Link to={fullPath} className="text-white">
                    {path.replace(/-/g, " ")}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
