import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/Config";
import MovieList from "../components/MovieList"; // Import MovieList

const Home = () => {
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [titleType, setTitleType] = useState("movie"); // Default value

  // Hardcoded list of title types
  const titleTypes = [
    "video",
    "tvSpecial",
    "tvSeries",
    "tvShort",
    "movie",
    "tvMovie",
    "short",
    "tvMiniSeries",
    "videoGame",
    "tvEpisode",
  ];

  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/TitleBasics/top-rated`,
          {
            params: {
              titleType, // Pass the titleType as a parameter
            },
          }
        );
        setTopRatedMovies(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch top-rated movies:", err);
        setError("Failed to load top-rated movies.");
        setLoading(false);
      }
    };

    fetchTopRatedMovies();
  }, [titleType]); // Dependency ensures re-fetching when titleType changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Top-Rated {titleType}</h1>

      {/* Dropdown to select titleType */}
      <select
        value={titleType}
        onChange={(e) => setTitleType(e.target.value)}
        style={{
          marginBottom: "20px",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      >
        {titleTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <MovieList movies={topRatedMovies} /> {/* Render MovieList */}
    </div>
  );
};

export default Home;
