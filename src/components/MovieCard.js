import React from "react";
import DynamicLink from "./DynamicLink"; // Import DynamicLink
import styles from "./MovieCard.module.css"; // Scoped styles for MovieCard

const MovieCard = ({ movie }) => {
  return (
    <DynamicLink id={movie.tconst} type="movies">
      <div className={styles.movieCard}>
        <img
          src={movie.poster || "https://via.placeholder.com/150x200"}
          alt={movie.primaryTitle}
          className={styles.moviePoster}
        />
        <div className={styles.movieDetails}>
          <h3>{movie.primaryTitle}</h3>
          <p><strong>Year:</strong> {movie.startYear || "Unknown"}</p>
          <p><strong>Rating:</strong> {movie.averageRating} ({movie.numVotes} votes)</p>
        </div>
      </div>
    </DynamicLink>
  );
};

export default MovieCard;
