import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, TMDB_API_KEY, TMDB_BASE_URL } from "../config/Config";
import Carousel from "../components/Carousel";
import DynamicLink from "../components/DynamicLink"; // Import the DynamicLink component

// Utility function to fetch TMDB profile images
const fetchProfileImage = async (name) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/person`, {
      params: {
        api_key: TMDB_API_KEY,
        query: name,
      },
    });

    const person = response.data.results[0]; // Take the first result
    if (person && person.profile_path) {
      return `https://image.tmdb.org/t/p/w200${person.profile_path}`;
    }
  } catch (error) {
    console.error(`Failed to fetch TMDB profile for ${name}:`, error);
  }

  // Fallback to a placeholder if no image is found
  return "https://via.placeholder.com/150x200";
};

const MovieDetail = () => {
  const { id } = useParams(); // Get the movie ID (tConst) from the route
  const [movie, setMovie] = useState(null); // Store movie details
  const [similarMovies, setSimilarMovies] = useState([]); // Store similar movies
  const [movieCast, setMovieCast] = useState([]); // Store movie cast
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
          { params: { tconst: id } }
        );
        setSimilarMovies(similarMoviesResponse.data); // Store similar movies

        console.log("Fetching movie cast...");
        const movieCastResponse = await axios.get(
          `${API_BASE_URL}/TitleBasics/movie-cast`,
          { params: { tconst: id } }
        );

        // Fetch profile images for cast members
        const updatedCast = await Promise.all(
          movieCastResponse.data.map(async (castMember) => ({
            ...castMember,
            photo: await fetchProfileImage(castMember.primaryname),
          }))
        );
        setMovieCast(updatedCast); // Store movie cast with photos

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

      <h2>Cast</h2>
      {movieCast.length > 0 ? (
        <Carousel
          movies={movieCast.map((castMember) => ({
            tconst: castMember.nconst, // Unique identifier for person
            primaryTitle: castMember.primaryname, // Actor's name
            plot: castMember.role, // Display the role as the plot
            poster: castMember.photo, // Use the fetched photo
          }))}
          visibleCount={5}
          renderItem={(castMember) => (
            <DynamicLink id={castMember.nconst} type="people">
              <div>
                <img src={castMember.poster} alt={castMember.primaryTitle} style={{ width: "150px", height: "200px" }} />
                <p>{castMember.primaryTitle}</p>
                <p style={{ fontSize: "14px" }}>{castMember.plot}</p>
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
          movies={similarMovies.map((movie) => ({
            tconst: movie.tconst, // Unique identifier for movie
            primaryTitle: movie.primaryTitle, // Movie title
            plot: movie.plot, // Movie description
            poster: movie.poster, // Movie poster
          }))}
          visibleCount={5}
          renderItem={(movie) => (
            <DynamicLink id={movie.tconst} type="movies">
              <div>
                <img src={movie.poster} alt={movie.primaryTitle} style={{ width: "150px", height: "200px" }} />
                <p>{movie.primaryTitle}</p>
                <p style={{ fontSize: "14px" }}>{movie.plot}</p>
              </div>
            </DynamicLink>
          )}
        />
      ) : (
        <div>No similar movies found.</div>
      )}
    </div>
  );
};

export default MovieDetail;
