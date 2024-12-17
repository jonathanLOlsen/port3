import React from "react";
import DynamicLink from "./DynamicLink"; // Import DynamicLink

const MovieCard = ({ movie }) => {
  return (
    <DynamicLink id={movie.tconst} type="movies">
      <div className="card shadow h-100" style={{ width: "18rem" }}>
        <img
          src={movie.poster || "https://via.placeholder.com/150x200"}
          alt={movie.primaryTitle}
          className="card-img-top"
          style={{ height: "300px", objectFit: "cover" }}
        />
        <div className="card-body d-flex flex-column justify-content-between">
          <h5 className="card-title">{movie.primaryTitle}</h5>
          <p className="card-text mb-1">
            <strong>Year:</strong> {movie.startYear || "Unknown"}
          </p>
          <p className="card-text">
            <strong>Rating:</strong> {movie.averageRating} ({movie.numVotes} votes)
          </p>
        </div>
      </div>
    </DynamicLink>
  );
};

export default MovieCard;
