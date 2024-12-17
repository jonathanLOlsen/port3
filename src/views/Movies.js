import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/Config";
import DynamicLink from "../components/DynamicLink";

const Movies = () => {
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      try {
        const genres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi"];

        const moviesByGenre = await Promise.all(
          genres.map(async (genre) => {
            const response = await axios.get(`${API_BASE_URL}/TitleBasics/movie-rankings-by-genre`, {
              params: { genre_param: genre },
            });

            if (!response.data || !Array.isArray(response.data)) {
              throw new Error(`Invalid response for genre: ${genre}`);
            }

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/TitleBasics/top-movie-search`, {
        params: { search_text: searchQuery },
      });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response for search query.");
      }

      setSearchResults(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch search results:", err);
      setError("Failed to load search results.");
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  return (
    <div className="container my-5">
      <h1 className="text-center mb-5 display-4">Top 5 Titles By Genre</h1>

      {/* Search Bar */}
      <form className="mb-4" onSubmit={handleSearch}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search for movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </div>
      </form>

      {/* Display Search Results */}
      {searchResults.length > 0 ? (
        <div>
          <h2 className="text-center mb-3">Search Results</h2>
          <div
            className="d-flex justify-content-center overflow-auto py-3"
            style={{ gap: "20px" }}
          >
            {searchResults.map((movie) => (
              <div
                key={movie.tConst}
                className="card flex-shrink-0 shadow-lg"
                style={{ width: "200px", borderRadius: "15px" }}
              >
                <DynamicLink id={movie.tConst} type="movies">
                  <img
                    src={movie.poster || "http://via.placeholder.com/200x300"}
                    className="card-img-top"
                    alt={movie.primaryTitle}
                    style={{
                      height: "300px",
                      objectFit: "cover",
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px",
                    }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{movie.primaryTitle}</h5>
                    <p className="card-text mb-1">
                      <strong>Rating:</strong> {movie.averageRating || "N/A"}
                    </p>
                    <p className="card-text">
                      <strong>Genre:</strong> {movie.genre || "Unknown"}
                    </p>
                  </div>
                </DynamicLink>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Display Genre-Based Layout */
        Object.entries(moviesByGenre).map(([genre, movies]) => (
          <div key={genre} className="mb-5">
            <h2 className="text-center mb-3">{genre}</h2>
            <div
              className="d-flex justify-content-center overflow-auto py-3"
              style={{ gap: "20px" }}
            >
              {movies.map((movie) => (
                <div
                  key={movie.tConst}
                  className="card flex-shrink-0 shadow-lg"
                  style={{ width: "200px", borderRadius: "15px" }}
                >
                  <DynamicLink id={movie.tConst} type="movies">
                    <img
                      src={movie.poster || "http://via.placeholder.com/200x300"}
                      className="card-img-top"
                      alt={movie.primaryTitle}
                      style={{
                        height: "300px",
                        objectFit: "cover",
                        borderTopLeftRadius: "15px",
                        borderTopRightRadius: "15px",
                      }}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title">{movie.primaryTitle}</h5>
                      <p className="card-text mb-1">
                        <strong>Rating:</strong> {movie.averageRating || "N/A"}
                      </p>
                      <p className="card-text">
                        <strong>Genre:</strong> {movie.genre || "Unknown"}
                      </p>
                    </div>
                  </DynamicLink>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Movies;
