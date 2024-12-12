import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, TMDB_API_KEY, TMDB_BASE_URL } from "../config/Config";
import DynamicLink from "../components/DynamicLink"; // Import DynamicLink

const Movies = () => {
  const [movies, setMovies] = useState([]); // Store the list of movies
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Step 1: Fetch movies from the TitleBasics/limited endpoint
        const response = await axios.get(`${API_BASE_URL}/TitleBasics/limited`, {
          params: { limit: 10, pageNumber: 1 }, // Adjust pagination as needed
        });

        const moviesFromBackend = response.data.items;

        // Step 2: Fetch additional data from TMDB for movies with missing posters
        const moviesWithDetails = await Promise.all(
          moviesFromBackend.map(async (movie) => {
            if (movie.poster) {
              // Use the backend poster if available
              return movie;
            }

            try {
              // Fetch poster and overview from TMDB using tConst (IMDB ID)
              const tmdbResponse = await axios.get(
                `${TMDB_BASE_URL}/find/${movie.tConst}`,
                {
                  params: {
                    api_key: TMDB_API_KEY,
                    external_source: "imdb_id",
                  },
                }
              );

              const tmdbMovie =
                tmdbResponse.data.movie_results[0] ||
                tmdbResponse.data.tv_results[0]; // Use the first result

              return {
                ...movie,
                poster: tmdbMovie?.poster_path
                  ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
                  : null,
                plot: movie.plot || tmdbMovie?.overview || "No description available.",
              };
            } catch (err) {
              console.error(`Failed to fetch additional details for ${movie.tConst}`, err);
              return { ...movie }; // Return the movie with backend data only
            }
          })
        );

        setMovies(moviesWithDetails);
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
              </div>
            </DynamicLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Movies;