import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/Config";
import Dropdown from "../components/Dropdown";
import Carousel from "../components/Carousel";

const Home = () => {
  const navigate = useNavigate();

  // State for the first carousel
  const [topRatedMovies1, setTopRatedMovies1] = useState([]);
  const [titleType1, setTitleType1] = useState("movie");

  // State for the second carousel
  const [topRatedMovies2, setTopRatedMovies2] = useState([]);
  const [titleType2, setTitleType2] = useState("tvSeries");

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
        setTopRatedMovies1(response1.data || []);

        // Fetch movies for the second carousel
        const response2 = await axios.get(`${API_BASE_URL}/TitleBasics/top-rated`, {
          params: { titleType: titleType2 },
        });
        setTopRatedMovies2(response2.data || []);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch top-rated movies:", err);
        setError("Failed to load top-rated movies.");
        setLoading(false);
      }
    };

    fetchMovies();
  }, [titleType1, titleType2]);

  // Function to handle movie click
  const handleMovieClick = (tConst) => {
    navigate(`/movies/${tConst}`);
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <div className="text-danger text-center my-5">{error}</div>;

  return (
    <div className="container my-5">
      {/* First Carousel Section */}
      <div className="mb-5">
        <h1 className="text-center mb-4">Top-Rated {titleType1}</h1>
        <div className="d-flex justify-content-center mb-4">
          <div className="w-100" style={{ maxWidth: "300px" }}>
            <Dropdown options={titleTypes} selectedValue={titleType1} onChange={setTitleType1} />
          </div>
        </div>
        <Carousel
          items={topRatedMovies1}
          visibleCount={5}
          renderItem={(movie) => (
            <div className="text-center p-2" onClick={() => handleMovieClick(movie.tconst)} style={{ cursor: "pointer" }}>
              <img
                src={movie.poster || "https://via.placeholder.com/217x300"}
                alt={movie.primaryTitle}
                className="img-fluid mb-2"
                style={{ width: "217px", height: "300px", objectFit: "cover" }}
              />
              <p className="fw-bold mb-1">{movie.primaryTitle}</p>
              <p className="text-muted">{movie.startYear}</p>
            </div>
          )}
        />
      </div>

      {/* Second Carousel Section */}
      <div className="mb-5">
        <h1 className="text-center mb-4">Top-Rated {titleType2}</h1>
        <div className="d-flex justify-content-center mb-4">
          <div className="w-100" style={{ maxWidth: "300px" }}>
            <Dropdown options={titleTypes} selectedValue={titleType2} onChange={setTitleType2} />
          </div>
        </div>
        <Carousel
          items={topRatedMovies2}
          visibleCount={5}
          renderItem={(movie) => (
            <div className="text-center p-2" onClick={() => handleMovieClick(movie.tconst)} style={{ cursor: "pointer" }}>
              <img
                src={movie.poster || "https://via.placeholder.com/217x300"}
                alt={movie.primaryTitle}
                className="img-fluid mb-2"
                style={{ width: "217px", height: "300px", objectFit: "cover" }}
              />
              <p className="fw-bold mb-1">{movie.primaryTitle}</p>
              <p className="text-muted">{movie.startYear}</p>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default Home;
