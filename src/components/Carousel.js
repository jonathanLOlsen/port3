import React, { useState } from "react";
import PropTypes from "prop-types";
import MovieCard from "./MovieCard"; // Ensure MovieCard is imported correctly
import styles from "./Carousel.module.css";

const Carousel = ({ items = [], visibleCount = 5, renderItem }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate the visible items
  const visibleItems = items.slice(currentIndex, currentIndex + visibleCount);

  // Handles the "Next" button
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + visibleCount >= items.length ? 0 : prevIndex + visibleCount
    );
  };

  // Handles the "Previous" button
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(items.length - visibleCount, 0) : prevIndex - visibleCount
    );
  };

  return (
    <div className={styles.carousel}>
      <button onClick={handlePrevious} className={styles.button}>
        &#8592;
      </button>
      <div className={styles.movieContainer}>
        {visibleItems.map((item, index) =>
          renderItem ? (
            <div key={index} className={styles.itemContainer}>
              {renderItem(item)}
            </div>
          ) : (
            <MovieCard key={index} movie={item} /> // Default behavior
          )
        )}
      </div>
      <button onClick={handleNext} className={styles.button}>
        &#8594;
      </button>
    </div>
  );
};

// Add PropTypes for validation
Carousel.propTypes = {
  items: PropTypes.array.isRequired, // Ensure 'items' is always an array
  visibleCount: PropTypes.number, // Number of items to show at a time
  renderItem: PropTypes.func, // Custom render function for items
};

// Default export
export default Carousel;
