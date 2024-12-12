import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import axios from "axios";
import { API_BASE_URL } from "../config/Config";
import Dropdown from "../components/Dropdown"; // Import the generic Dropdown component
import Carousel from "../components/Carousel"; // Import the updated Carousel component

const Home = () => {
  const navigate = useNavigate(); // Hook for navigation

  // State for the first carousel
  const [topRatedMovies1, setTopRatedMovies1] = useState([]);
  const [titleType1, setTitleType1] = useState("movie"); // Default value for the first carousel

  // State for the second carousel
  const [topRatedMovies2, setTopRatedMovies2] = useState([]);
  const [titleType2, setTitleType2] = useState("tvSeries"); // Default value for the second carousel

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const fetchMovies = async () => {
      try {
        // Fetch movies for the first carousel
        const response1 = await axios.get(`${API_BASE_URL}/TitleBasics/top-rated`, {
          params: { titleType: titleType1 },
        });
        setTopRatedMovies1(response1.data || []); // Fallback to empty array if no data

        // Fetch movies for the second carousel
        const response2 = await axios.get(`${API_BASE_URL}/TitleBasics/top-rated`, {
          params: { titleType: titleType2 },
        });
        setTopRatedMovies2(response2.data || []); // Fallback to empty array if no data

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch top-rated movies:", err);
        setError("Failed to load top-rated movies.");
        setLoading(false);
      }
    };

    fetchMovies();
  }, [titleType1, titleType2]); // Re-fetch when either titleType changes

  // Function to handle movie click
  const handleMovieClick = (tConst) => {
    navigate(`/movies/${tConst}`); // Navigate to the MovieDetail view
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* First Carousel */}
      <h1>Top-Rated {titleType1}</h1>
      <Dropdown
        options={titleTypes} // Pass the list of title types
        selectedValue={titleType1} // Pass the selected value
        onChange={setTitleType1} // Update the state for the first carousel
      />
      <Carousel
        items={topRatedMovies1} // Updated to `items`
        visibleCount={5} // Number of items visible
        renderItem={(movie) => (
          <div onClick={() => handleMovieClick(movie.tconst)} style={{ cursor: "pointer" }}>
            <img
              src={movie.poster}
              alt={movie.primaryTitle}
              style={{ width: "150px", height: "200px" }}
            />
            <p>{movie.primaryTitle}</p>
            <p>{movie.startYear}</p>
          </div>
        )}
      />

      {/* Second Carousel */}
      <h1>Top-Rated {titleType2}</h1>
      <Dropdown
        options={titleTypes} // Pass the list of title types
        selectedValue={titleType2} // Pass the selected value
        onChange={setTitleType2} // Update the state for the second carousel
      />
      <Carousel
        items={topRatedMovies2} // Updated to `items`
        visibleCount={5} // Number of items visible
        renderItem={(movie) => (
          <div onClick={() => handleMovieClick(movie.tconst)} style={{ cursor: "pointer" }}>
            <img
              src={movie.poster}
              alt={movie.primaryTitle}
              style={{ width: "150px", height: "200px" }}
            />
            <p>{movie.primaryTitle}</p>
            <p>{movie.startYear}</p>
          </div>
        )}
      />
    </div>
  );
};

export default Home;
