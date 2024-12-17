import React, { useState } from "react";
import PropTypes from "prop-types";

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
    <div className="position-relative my-4">
      <button
        onClick={handlePrevious}
        className="btn btn-primary position-absolute top-50 start-0 translate-middle-y px-3 py-2 shadow"
        style={{ zIndex: 1 }}
      >
        &#8592;
      </button>
      <div className="d-flex justify-content-center overflow-hidden">
        <div className="d-flex justify-content-between gap-4">
          {visibleItems.map((item, index) => (
            <div key={index} className="flex-shrink-0" style={{ width: "217px" }}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleNext}
        className="btn btn-primary position-absolute top-50 end-0 translate-middle-y px-3 py-2 shadow"
        style={{ zIndex: 1 }}
      >
        &#8594;
      </button>
    </div>
  );
};

Carousel.propTypes = {
  items: PropTypes.array.isRequired,
  visibleCount: PropTypes.number,
  renderItem: PropTypes.func.isRequired,
};

export default Carousel;
