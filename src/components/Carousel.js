import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./Carousel.module.css";

// Utility function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return "No description available.";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

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
          <div key={index} className={styles.movieCard}>
            <img
              src={movie.poster || "https://via.placeholder.com/150x200"}
              alt={movie.primaryTitle || "No title"}
              className={styles.image}
            />
            <div className={styles.details}>
              <h3>{movie.primaryTitle || "Unknown"}</h3>
              <p>{truncateText(movie.plot, 100)}</p> {/* Limit description to 100 characters */}
            </div>
          </div>
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
      poster: PropTypes.string,
      primaryTitle: PropTypes.string,
      plot: PropTypes.string,
    })
  ).isRequired,
  visibleCount: PropTypes.number, // Number of movies to show at a time
};

export default Carousel;
