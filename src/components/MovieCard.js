import React from "react";

const MovieCard = ({ title, imageUrl, description, averageRating }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        width: "200px",
        textAlign: "center",
      }}
    >
      <img
        src={imageUrl || "https://via.placeholder.com/150x200"}
        alt={title}
        style={{
          width: "100%",
          height: "300px",
          objectFit: "cover",
        }}
      />
      <h3 style={{ fontSize: "16px", margin: "10px 0" }}>{title}</h3>
      <p style={{ fontSize: "14px", color: "#555" }}>{description}</p>
      {averageRating && (
        <p>
          <strong>Rating:</strong> {averageRating}/10
        </p>
      )}
    </div>
  );
};

export default MovieCard;
