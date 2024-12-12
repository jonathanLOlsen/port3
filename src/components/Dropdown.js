import React from "react";
import PropTypes from "prop-types"; // To define prop types for validation
import styles from "./Dropdown.module.css"; // Import CSS module for styling

const Dropdown = ({ options, selectedValue, onChange }) => {
  return (
    <div className={styles.dropdownContainer}>
      <select
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
        className={styles.dropdown}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

// Prop types for better type checking
Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of strings for dropdown options
  selectedValue: PropTypes.string.isRequired, // Currently selected value
  onChange: PropTypes.func.isRequired, // Callback for when selection changes
};

export default Dropdown;
