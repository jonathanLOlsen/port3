import React from "react";
import PropTypes from "prop-types";

const Dropdown = ({ options, selectedValue, onChange }) => {
  return (
    <div className="d-flex justify-content-center">
      <select
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
        className="form-select form-select-lg"
        style={{ width: "100%", maxWidth: "300px", fontSize: "1.1rem" }}
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

Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Dropdown;
