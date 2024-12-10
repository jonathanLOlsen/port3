import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/Config";

const MovieDetail = () => {
  const { id } = useParams(); // Get the movie ID (tConst) from the route
  const [movie, setMovie] = useState(null); // Store movie details
  const [nameBasics, setNameBasics] = useState(null); // Store name details
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Fetch the specific movie from the TitleBasics endpoint
        const movieResponse = await axios.get(`${API_BASE_URL}/TitleBasics/${id}`);
        setMovie(movieResponse.data); // Store the movie details

        // Fetch additional details from NameBasics endpoint
        const nameBasicsResponse = await axios.get(`${API_BASE_URL}/NameBasics/${id}`);
        setNameBasics(nameBasicsResponse.data); // Store the name details

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch movie or name details:", err);
        setError("Failed to load details.");
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Movie Details</h1>
      <pre
        style={{
          background: "#f4f4f4",
          padding: "10px",
          borderRadius: "8px",
          overflowX: "auto",
          fontFamily: "monospace",
        }}
      >
        {JSON.stringify(movie, null, 2)} {/* Display movie data */}
      </pre>
      <h2>Name Basics</h2>
      <pre
        style={{
          background: "#f4f4f4",
          padding: "10px",
          borderRadius: "8px",
          overflowX: "auto",
          fontFamily: "monospace",
        }}
      >
        {JSON.stringify(nameBasics, null, 2)} {/* Display name basics data */}
      </pre>
    </div>
  );
};

export default MovieDetail;
