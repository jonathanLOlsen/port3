import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config/Config";
import Carousel from "../components/Carousel";

const MovieDetail = () => {
  const { id } = useParams(); // Get the movie ID (tConst) from the route
  const [movie, setMovie] = useState(null); // Store movie details
  const [similarMovies, setSimilarMovies] = useState([]); // Store similar movies
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track errors

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        console.log(`Fetching movie details for tconst: ${id}`);
        const movieResponse = await axios.get(`${API_BASE_URL}/TitleBasics/${id}`);
        setMovie(movieResponse.data); // Store the movie details

        console.log("Fetching similar movies...");
        const similarMoviesResponse = await axios.get(
          `${API_BASE_URL}/TitleBasics/similar-movies`,
          { params: { tconst: id } } // Correct query parameter
        );
        setSimilarMovies(similarMoviesResponse.data); // Store similar movies

        setLoading(false);
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Failed to load movie details. Please try again later.");
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Movie Details</h1>
      {movie ? (
        <div>
          <h2>{movie.primaryTitle}</h2>
          <p>{movie.plot}</p>
          {movie.poster && <img src={movie.poster} alt={movie.primaryTitle} style={{ maxWidth: "300px" }} />}
          <ul>
            <li><strong>Type:</strong> {movie.titleType}</li>
            <li><strong>Start Year:</strong> {movie.startYear}</li>
            <li><strong>Runtime:</strong> {movie.runtimeMinutes} minutes</li>
          </ul>
        </div>
      ) : (
        <div>No movie details found.</div>
      )}

      <h2>Similar Movies</h2>
      {similarMovies.length > 0 ? (
        <Carousel movies={similarMovies} visibleCount={5} />
      ) : (
        <div>No similar movies found.</div>
      )}
    </div>
  );
};

export default MovieDetail;
