import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/Config";
import DynamicLink from "../components/DynamicLink"; // Import DynamicLink

const Movies = () => {
  const [moviesByGenre, setMoviesByGenre] = useState({}); // Store movies grouped by genres
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      try {
        const genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi"]; // Specify genres to fetch
  
        const moviesByGenre = await Promise.all(
          genres.map(async (genre) => {
            const response = await axios.get(`${API_BASE_URL}/TitleBasics/movie-rankings-by-genre`, {
              params: { genre_param: genre }, // Updated to match the API parameter name
            });
  
            const movies = response.data.slice(0, 5);
  
            return [genre, movies];
          })
        );
  
        setMoviesByGenre(Object.fromEntries(moviesByGenre));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch movies by genre:", err);
        setError("Failed to load movies by genre.");
        setLoading(false);
      }
    };
  
    fetchMoviesByGenre();
  }, []);
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Movies by Genre</h1>
      {Object.entries(moviesByGenre).map(([genre, movies]) => (
        <div key={genre} style={{ marginBottom: "40px" }}>
          <h2>{genre}</h2>
          <ul style={{ listStyleType: "none", padding: 0, display: "flex", gap: "10px", overflowX: "auto" }}>
            {movies.map((movie) => (
              <li
                key={movie.tConst}
                style={{
                  minWidth: "150px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <DynamicLink id={movie.tConst} type="movies">
                  <img
                    src={movie.poster || "http://via.placeholder.com/150x200"}
                    alt={movie.primaryTitle}
                    style={{ width: "150px", height: "200px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "10px", textAlign: "left" }}>
                    <h3 style={{ fontSize: "16px", margin: "5px 0" }}>{movie.primaryTitle}</h3>
                    <p style={{ fontSize: "14px" }}>
                      <strong>Year:</strong> {movie.startYear || "Unknown"}
                    </p>
                    <p style={{ fontSize: "14px" }}>
                      <strong>Plot:</strong> {movie.plot || "No description available."}
                    </p>
                  </div>
                </DynamicLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Movies;
