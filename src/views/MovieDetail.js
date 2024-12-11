import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/Config";

const MovieDetail = () => {
  const { id } = useParams(); // Get the movie ID (tConst) from the route
  console.log("Movie ID:", id);
  const [movie, setMovie] = useState(null); // Store movie details
  const [nameBasics, setNameBasics] = useState(null); // Store name details
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        console.log("Fetching movie details from:", `${API_BASE_URL}/TitleBasics/${id}`);
        const movieResponse = await axios.get(`${API_BASE_URL}/TitleBasics/${id}`);
        setMovie(movieResponse.data); // Store the movie details

        // Fetch additional details from NameBasics endpoint
        try {
          const nameBasicsResponse = await axios.get(`${API_BASE_URL}/NameBasics/${id}`);
          setNameBasics(nameBasicsResponse.data); // Store the name details
        } catch (nameErr) {
          console.warn("Name details not found:", nameErr);
          setNameBasics(null); // Handle gracefully if NameBasics is not found
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch movie details:", err);
        setError("Failed to load movie details. Please try again later.");
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
      {movie ? (
        <div>
          <h2>{movie.primaryTitle}</h2>
          <p>{movie.plot}</p>
          {movie.poster && <img src={movie.poster} alt={movie.primaryTitle} style={{ maxWidth: "300px" }} />}
          <ul>
            <li><strong>Type:</strong> {movie.titleType}</li>
            <li><strong>Start Year:</strong> {movie.startYear}</li>
            <li><strong>Runtime:</strong> {movie.runtimeMinutes} minutes</li>
          </ul>
        </div>
      ) : (
        <div>No movie details available.</div>
      )}
      <h2>Name Basics</h2>
      {nameBasics ? (
        <pre
          style={{
            background: "#f4f4f4",
            padding: "10px",
            borderRadius: "8px",
            overflowX: "auto",
            fontFamily: "monospace",
          }}
        >
          {JSON.stringify(nameBasics, null, 2)} {/* Display name details */}
        </pre>
      ) : (
        <div>No name details available.</div>
      )}
    </div>
  );
};

export default MovieDetail;
