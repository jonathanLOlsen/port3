import React from "react";
import { Link } from "react-router-dom";

const MovieLink = ({ tConst, children, style }) => {
  return (
    <Link
      to={`/movies/${tConst}`} // Navigate to the movie detail page
      style={{ textDecoration: "none", color: "inherit", ...style }}
    >
      {children}
    </Link>
  );
};

export default MovieLink;
