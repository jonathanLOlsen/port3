import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, TMDB_API_KEY, TMDB_BASE_URL } from "../config/Config";
import Carousel from "../components/Carousel";
import DynamicLink from "../components/DynamicLink";

// Utility function to fetch TMDB profile images
const fetchProfileImage = async (name) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/person`, {
      params: { api_key: TMDB_API_KEY, query: name },
    });
    const person = response.data.results[0];
    if (person && person.profile_path) {
      return `https://image.tmdb.org/t/p/w200${person.profile_path}`;
    }
  } catch (error) {
    console.error(`Failed to fetch TMDB profile for ${name}:`, error);
  }
  return "https://via.placeholder.com/150x200"; // Default placeholder image
};

const MovieDetail = () => {
  const { id } = useParams(); // Get the movie ID (tConst) from the route
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]); // Default: empty array
  const [movieCast, setMovieCast] = useState([]); // Default: empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        console.log(`Fetching movie details for tconst: ${id}`);
        const movieResponse = await axios.get(`${API_BASE_URL}/TitleBasics/${id}`);
        console.log("Fetched Movie Data:", movieResponse.data); // Debug log
        setMovie(movieResponse.data);

        console.log("Fetching similar movies...");
        const similarMoviesResponse = await axios.get(
          `${API_BASE_URL}/TitleBasics/similar-movies`,
          { params: { tconst: id } }
        );
        console.log("Fetched Similar Movies:", similarMoviesResponse.data); // Debug log
        setSimilarMovies(similarMoviesResponse.data || []);

        console.log("Fetching movie cast...");
        const movieCastResponse = await axios.get(
          `${API_BASE_URL}/TitleBasics/movie-cast`,
          { params: { tconst: id } }
        );
        console.log("Fetched Movie Cast:", movieCastResponse.data); // Debug log
        const updatedCast = await Promise.all(
          (movieCastResponse.data || []).map(async (castMember) => ({
            ...castMember,
            photo: await fetchProfileImage(castMember.primaryname),
          }))
        );
        setMovieCast(updatedCast);

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
      <h1>{movie?.titleType || "Movie"} Details</h1>
      {movie ? (
        <div>
          <h2>{movie.primaryTitle || "Untitled"}</h2>
          <p>{movie.plot || "Plot information is not available."}</p>
          {movie.poster ? (
            <img
              src={movie.poster}
              alt={movie.primaryTitle || "Poster"}
              style={{ maxWidth: "300px" }}
            />
          ) : (
            <img
              src="https://via.placeholder.com/300"
              alt="No poster available"
              style={{ maxWidth: "300px" }}
            />
          )}
          <ul>
            <li>
              <strong>Type:</strong> {movie.titleType || "Unknown"}
            </li>
            <li>
              <strong>Start Year:</strong> {movie.startYear || "Unknown"}
            </li>
            <li>
              <strong>Runtime:</strong>{" "}
              {movie.runtimeMinutes !== null && movie.runtimeMinutes !== undefined
                ? `${movie.runtimeMinutes} minutes`
                : "Runtime not available"}
            </li>
          </ul>
        </div>
      ) : (
        <div>No movie details found.</div>
      )}

      <h2>Cast</h2>
      {movieCast.length > 0 ? (
        <Carousel
          items={movieCast}
          visibleCount={5}
          renderItem={(castMember) => (
            <DynamicLink id={castMember.nconst} type="people">
              <div>
                <img
                  src={castMember.photo}
                  alt={castMember.primaryname}
                  style={{ width: "150px", height: "200px" }}
                />
                <p>{castMember.primaryname}</p>
                <p style={{ fontSize: "14px" }}>{castMember.role}</p>
              </div>
            </DynamicLink>
          )}
        />
      ) : (
        <div>No cast information found.</div>
      )}

      <h2>Similar Movies</h2>
      {similarMovies.length > 0 ? (
        <Carousel
          items={similarMovies}
          visibleCount={5}
          renderItem={(movie) => {
            const truncatedPlot = movie.plot
              ? movie.plot.length > 150
                ? movie.plot.substring(0, 150) + "..."
                : movie.plot
              : "No Plot Available";

            return (
              <DynamicLink id={movie.similar_tconst || "undefined"} type="movies">
                <div>
                  <img
                    src={movie.poster || "https://via.placeholder.com/150x200"}
                    alt={movie.primarytitle || "No Title"}
                    style={{ width: "181px", height: "250px" }}
                  />
                  <p>{movie.primarytitle || "Unknown Title"}</p>
                  <p style={{ fontSize: "14px" }}>{truncatedPlot}</p>
                </div>
              </DynamicLink>
            );
          }}
        />
      ) : (
        <div>No similar movies found.</div>
      )}

      {/* Back Button */}
      <button onClick={() => window.history.back()}>Go Back</button>
    </div>
  );
};

export default MovieDetail;
