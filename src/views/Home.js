import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/Config";
import MovieList from "../components/MovieList"; // Import MovieList

const Home = () => {
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      try {
        // API call to fetch top-rated movies
        const response = await axios.get(`${API_BASE_URL}/TitleBasics/top-rated`);
        setTopRatedMovies(response.data); // Update state with the response data
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
      <MovieList movies={topRatedMovies} /> {/* Pass movies to the MovieList component */}
    </div>
  );
};

export default Home;
