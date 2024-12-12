import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/Config";
import DynamicLink from "../components/DynamicLink"; // Import DynamicLink

const Movies = () => {
  const [movies, setMovies] = useState([]); // Store the list of movies
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch movies from the backend
        const response = await axios.get(`${API_BASE_URL}/TitleBasics/limited`, {
          params: { limit: 10, pageNumber: 1 }, // Adjust pagination as needed
        });

        setMovies(response.data.items); // Use backend data directly
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Failed to load movies.");
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Movies</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {movies.map((movie) => (
          <li
            key={movie.tConst}
            style={{
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Wrap the movie item with DynamicLink */}
            <DynamicLink id={movie.tConst} type="movies">
              {/* Movie Poster */}
              <img
                src={movie.poster || "http://via.placeholder.com/150x200"}
                alt={movie.primaryTitle}
                style={{ width: "150px", height: "200px", objectFit: "cover" }}
              />

              {/* Movie Details */}
              <div style={{ padding: "10px", textAlign: "left" }}>
                <h3>{movie.primaryTitle}</h3>
                <p>
                  <strong>Year:</strong> {movie.startYear || "Unknown"}
                </p>
                <p>
                  <strong>Plot:</strong> {movie.plot || "No description available."}
                </p>
              </div>
            </DynamicLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Movies;
