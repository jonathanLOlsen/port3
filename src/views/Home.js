import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/Config";
import MovieList from "../components/MovieList"; // Import MovieList
import Dropdown from "../components/Dropdown"; // Import the generic Dropdown component

const Home = () => {
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [titleType, setTitleType] = useState("movie"); // Default value

  // Hardcoded list of title types
  const titleTypes = [
    "movie",
    "tvEpisode",
    "tvSeries",
    "tvMiniSeries",
    "tvSpecial",
    "short",
    "video",
    "documentary",
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
      
      {/* Use the generic Dropdown component */}
      <Dropdown
        options={titleTypes} // Pass the list of title types
        selectedValue={titleType} // Pass the selected value
        onChange={setTitleType} // Pass the state update function
      />

      <MovieList movies={topRatedMovies} /> {/* Render MovieList */}
    </div>
  );
};

export default Home;
