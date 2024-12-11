import React from "react";

const PeopleCard = ({ name, imageUrl, rating, birth }) => {
    return (
        <div
            style ={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflow: "hidden",
                width: "200px",
                textAlign: "center",
            }}
        >
            <img
                src={imageUrl || "https://via.placeholder.com/150x200"}
                alt={name}
                style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                  }}
            />
            <h3 style={{ fontSize: "16px", margin: "10px 0" }}>{name}</h3>
            <p style={{ fontSize: "14px", color: "#555" }}>Rating: {rating}</p>
            <p style={{ fontSize: "14px", color: "#555" }}>{birth}</p>

        </div>
    );
};

export default PeopleCard;