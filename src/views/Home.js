import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/Config";
import DynamicLink from "../components/DynamicLink"; // Import DynamicLink

const Home = () => {
  const [topRatedMovies, setTopRatedMovies] = useState([]); // Store top-rated movies
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      try {
        // Fetch top-rated movies from the new endpoint
        const response = await axios.get(`${API_BASE_URL}/TitleBasics/top-rated-with-details`, {
          params: {
            limit: 100, // Number of movies to fetch
            minVotes: 100, // Minimum number of votes
          },
        });

        setTopRatedMovies(response.data); // Store the result
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch top-rated movies:", err);
        setError("Failed to load top-rated movies.");
        setLoading(false);
      }
    };

    fetchTopRatedMovies();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Top-Rated Movies and TV Shows</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {topRatedMovies.map((movie) => (
          <li
            key={movie.tconst}
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
            <DynamicLink id={movie.tconst} type="movies">
              {/* Movie Poster */}
              <img
                src={movie.poster || "https://via.placeholder.com/150x200"}
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
                <p>
                  <strong>Rating:</strong> {movie.averageRating} ({movie.numVotes} votes)
                </p>
              </div>
            </DynamicLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
