import React from "react";

const PeopleCard = ({ name, imageUrl, rating, birth }) => {
  return (
    <div className="card shadow h-100 text-center">
      <img
        src={imageUrl || "https://via.placeholder.com/150x200"}
        alt={name}
        className="card-img-top"
        style={{ height: "300px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text mb-1">
          <strong>Rating:</strong> {rating}
        </p>
        <p className="card-text">
          <strong>Birth:</strong> {birth}
        </p>
      </div>
    </div>
  );
};

export default PeopleCard;
