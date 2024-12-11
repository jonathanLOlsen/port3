import React from "react";
import MovieCard from "./MovieCard"; // Import the MovieCard component
import styles from "./MovieList.module.css"; // Scoped styles for MovieList

const MovieList = ({ movies }) => {
  return (
    <ul className={styles.movieList}>
      {movies.map((movie) => (
        <li key={movie.tconst} className={styles.movieItem}>
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  );
};

export default MovieList;