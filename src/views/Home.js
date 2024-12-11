import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/Config";
import MovieCard from "../components/MovieCard";
import DynamicLink from "../components/DynamicLink"; // Updated import

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/TitleBasics/limited`, {
          params: { limit: 10, pageNumber: 1 },
        });

        setMovies(response.data.items);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Failed to load movies.");
      }
    };

    fetchMovies();
  }, []);

  return (
    <div>
      <h1>Top 10 Movies and TV Shows</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {movies.map((movie) => (
          <DynamicLink
            id={movie.tConst} // Pass the unique identifier for each movie
            type="movies" // Specify the type
            key={movie.tConst}
          >
            <MovieCard
              title={movie.primaryTitle}
              imageUrl={movie.poster}
              description={movie.plot}
              averageRating={movie.averageRating}
            />
          </DynamicLink>
        ))}
      </div>
    </div>
  );
};

export default Home;
