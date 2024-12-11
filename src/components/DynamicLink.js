import React from "react";
import { Link } from "react-router-dom";

const DynamicLink = ({ id, type = "movies", children, style }) => {
  return (
    <Link
      to={`/${type}/${id}`} // Dynamic route based on type and ID
      style={{ textDecoration: "none", color: "inherit", ...style }}
    >
      {children}
    </Link>
  );
};

export default DynamicLink;
