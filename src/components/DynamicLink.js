import React from "react";
import { Link } from "react-router-dom";

const DynamicLink = ({ id, type = "movies", customPath = "", children, style }) => {
  const path = customPath ? `/${type}/${id}/${customPath}` : `/${type}/${id}`;
  console.log("Generated path for DynamicLink:", path); // Debug path

  return (
    <Link
      to={path}
      style={{ textDecoration: "none", color: "inherit", ...style }}
    >
      {children}
    </Link>
  );
};

export default DynamicLink;

