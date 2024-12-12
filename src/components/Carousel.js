import React, { useState } from "react";
import PropTypes from "prop-types";
import MovieCard from "./MovieCard"; // Import MovieCard
import styles from "./Carousel.module.css";

const Carousel = ({ movies, visibleCount = 5 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate the visible movies
  const visibleMovies = movies.slice(currentIndex, currentIndex + visibleCount);

  // Handles the "Next" button
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + visibleCount >= movies.length ? 0 : prevIndex + visibleCount
    );
  };

  // Handles the "Previous" button
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(movies.length - visibleCount, 0) : prevIndex - visibleCount
    );
  };

  return (
    <div className={styles.carousel}>
      <button onClick={handlePrevious} className={styles.button}>
        &#8592;
      </button>
      <div className={styles.movieContainer}>
        {visibleMovies.map((movie, index) => (
          <MovieCard key={index} movie={movie} /> // Use MovieCard for rendering
        ))}
      </div>
      <button onClick={handleNext} className={styles.button}>
        &#8594;
      </button>
    </div>
  );
};

// Prop types for validation
Carousel.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      tconst: PropTypes.string.isRequired,
      poster: PropTypes.string,
      primaryTitle: PropTypes.string,
      startYear: PropTypes.string,
      averageRating: PropTypes.number,
      numVotes: PropTypes.number,
    })
  ).isRequired,
  visibleCount: PropTypes.number, // Number of movies to show at a time
};

export default Carousel;
