import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, TMDB_API_KEY, TMDB_BASE_URL } from "../config/Config";
import Carousel from "../components/Carousel";
import DynamicLink from "../components/DynamicLink";
import { useAuth } from "../AuthContext";

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
  return "https://via.placeholder.com/150x200"; // Default image
};

const MovieDetail = () => {
  const { id } = useParams();
  const { userId, username } = useAuth();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [movieCast, setMovieCast] = useState([]);
  const [loading, setLoading] = useState({
    movie: true,
    similarMovies: true,
    cast: true,
  });
  const [error, setError] = useState({
    movie: null,
    similarMovies: null,
    cast: null,
  });
  const [bookmarkMessage, setBookmarkMessage] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await axios.get(`${API_BASE_URL}/TitleBasics/${id}`);
        setMovie(movieResponse.data);
        setError((prev) => ({ ...prev, movie: null }));
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError((prev) => ({
          ...prev,
          movie: "Failed to load movie details. Please try again later.",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, movie: false }));
      }
    };

    const fetchSimilarMovies = async () => {
      try {
        const similarMoviesResponse = await axios.get(
          `${API_BASE_URL}/TitleBasics/similar-movies`,
          { params: { tconst: id } }
        );
        setSimilarMovies(similarMoviesResponse.data || []);
        setError((prev) => ({ ...prev, similarMovies: null }));
      } catch (err) {
        console.error("Error fetching similar movies:", err);
        setError((prev) => ({
          ...prev,
          similarMovies: "Failed to load similar movies. Please try again later.",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, similarMovies: false }));
      }
    };

    const fetchMovieCast = async () => {
      try {
        const movieCastResponse = await axios.get(
          `${API_BASE_URL}/TitleBasics/movie-cast`,
          { params: { tconst: id } }
        );
        const updatedCast = await Promise.all(
          (movieCastResponse.data || []).map(async (castMember) => ({
            ...castMember,
            photo: await fetchProfileImage(castMember.primaryname),
          }))
        );
        setMovieCast(updatedCast);
        setError((prev) => ({ ...prev, cast: null }));
      } catch (err) {
        console.error("Error fetching movie cast:", err);
        setError((prev) => ({
          ...prev,
          cast: "Failed to load movie cast. Please try again later.",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, cast: false }));
      }
    };

    fetchMovieDetails();
    fetchSimilarMovies();
    fetchMovieCast();
  }, [id]);

  const handleBookmark = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/UserBookmarks`,
        {
          userId,
          tconst: id,
          note: `${username}'s bookmark`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setBookmarkMessage("Movie successfully bookmarked!");
      } else {
        setBookmarkMessage("Failed to bookmark the movie.");
      }
    } catch (err) {
      console.error("Error bookmarking movie:", err);
      setBookmarkMessage("An error occurred while bookmarking the movie.");
    } finally {
      setTimeout(() => setBookmarkMessage(null), 3000);
    }
  };

  if (loading.movie && loading.similarMovies && loading.cast) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      <button
        onClick={handleBookmark}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          padding: "10px 15px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Bookmark
      </button>
      {bookmarkMessage && (
        <div style={{ position: "absolute", top: "60px", right: "20px", color: "green" }}>
          {bookmarkMessage}
        </div>
      )}
      <h1>{movie?.titleType || "Movie"} Details</h1>
      {error.movie ? (
        <div style={{ color: "red" }}>{error.movie}</div>
      ) : movie ? (
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
        </div>
      ) : (
        <div>No movie details found.</div>
      )}

      <h2>Cast</h2>
      {error.cast ? (
        <div style={{ color: "red" }}>{error.cast}</div>
      ) : movieCast.length > 0 ? (
        <Carousel
          items={movieCast}
          visibleCount={5}
          renderItem={(castMember) => (
            <DynamicLink id={castMember.nconst} type="people">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "150px", height: "300px" }}>
                <img
                  src={castMember.photo || "https://via.placeholder.com/150x200"}
                  alt={castMember.primaryname || "Unknown Name"}
                  style={{ width: "150px", height: "200px", objectFit: "cover", borderRadius: "4px" }}
                />
                <p style={{ margin: "10px 0 5px", fontWeight: "bold" }}>{castMember.primaryname || "Unknown Name"}</p>
                <p style={{ fontSize: "14px", color: "#666" }}>{castMember.role || "Unknown Role"}</p>
              </div>
            </DynamicLink>
          )}
        />
      ) : (
        <div>No cast information found.</div>
      )}

      <h2>Similar Movies</h2>
      {error.similarMovies ? (
        <div style={{ color: "red" }}>{error.similarMovies}</div>
      ) : similarMovies.length > 0 ? (
        <Carousel
          items={similarMovies}
          visibleCount={5}
          renderItem={(movie) => (
            <DynamicLink id={movie.similar_tconst || "undefined"} type="movies">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "181px", height: "350px" }}>
                <img
                  src={movie.poster || "https://via.placeholder.com/181x250"}
                  alt={movie.primarytitle || "No Title"}
                  style={{ width: "181px", height: "250px", objectFit: "cover", borderRadius: "4px" }}
                />
                <p style={{ margin: "10px 0 5px", fontWeight: "bold" }}>{movie.primarytitle || "Unknown Title"}</p>
                <p style={{ fontSize: "14px", color: "#666", textAlign: "center" }}>
                  {movie.plot && movie.plot.length > 150
                    ? movie.plot.substring(0, 150) + "..."
                    : movie.plot || "No Plot Available"}
                </p>
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
