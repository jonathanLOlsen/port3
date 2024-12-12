import React from "react";
import { Link } from "react-router-dom";

const DynamicLink = ({ id, type = "movies", children, style }) => {
  const path = `/${type}/${id}`;
  console.log("Generated path for DynamicLink:", path); // Log the generated path

  return (
    <Link
      to={path} // Use the generated path
      style={{ textDecoration: "none", color: "inherit", ...style }}
    >
      {children}
    </Link>
  );
};

export default DynamicLink;
