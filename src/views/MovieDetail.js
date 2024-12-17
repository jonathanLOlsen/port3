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
    return person?.profile_path
      ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
      : "https://via.placeholder.com/150x200";
  } catch (error) {
    console.error(`Failed to fetch TMDB profile for ${name}:`, error);
    return "https://via.placeholder.com/150x200";
  }
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
  const [userRating, setUserRating] = useState("");
  const [ratingSuccess, setRatingSuccess] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/TitleBasics/${id}`);
        setMovie(response.data);
        setError((prev) => ({ ...prev, movie: null }));
      } catch (err) {
        setError((prev) => ({
          ...prev,
          movie: "Failed to load movie details. Please try again later.",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, movie: false }));
      }
    };

    const fetchMovieCast = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/TitleBasics/movie-cast`, {
          params: { tconst: id },
        });
        const updatedCast = await Promise.all(
          (response.data || []).map(async (castMember) => ({
            ...castMember,
            photo: await fetchProfileImage(castMember.primaryname),
          }))
        );
        setMovieCast(updatedCast);
      } catch (err) {
        setError((prev) => ({ ...prev, cast: "Failed to load movie cast." }));
      } finally {
        setLoading((prev) => ({ ...prev, cast: false }));
      }
    };

    const fetchSimilarMovies = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/TitleBasics/similar-movies`, {
          params: { tconst: id },
        });
        setSimilarMovies(response.data || []);
      } catch (err) {
        setError((prev) => ({
          ...prev,
          similarMovies: "Failed to load similar movies.",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, similarMovies: false }));
      }
    };

    fetchMovieDetails();
    fetchMovieCast();
    fetchSimilarMovies();
  }, [id]);

  const handleBookmark = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/UserBookmarks`,
        { userId, tconst: id, note: `${username}'s bookmark` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookmarkMessage("Movie successfully bookmarked!");
    } catch (err) {
      setBookmarkMessage("Failed to bookmark the movie.");
    } finally {
      setTimeout(() => setBookmarkMessage(null), 3000);
    }
  };

  if (loading.movie) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container my-5">
      {bookmarkMessage && <div className="alert alert-success">{bookmarkMessage}</div>}

      <div className="position-relative mb-5">
        <button
          className="btn btn-primary position-absolute top-0 end-0"
          onClick={handleBookmark}
        >
          Bookmark
        </button>

        <div className="row">
          <div className="col-md-4">
            <img
              src={movie.poster || "https://via.placeholder.com/300"}
              alt={movie.primaryTitle || "Poster"}
              className="img-fluid rounded"
            />
          </div>
          <div className="col-md-8 d-flex flex-column justify-content-between">
            <div>
              <h1 className="mb-3">{movie.primaryTitle || "Untitled"}</h1>
              <p className="text-muted">{movie.plot || "No description available."}</p>
            </div>
            <form className="mt-3">
              <input
                type="number"
                className="form-control mb-2"
                value={userRating}
                onChange={(e) => setUserRating(e.target.value)}
                placeholder="Enter rating (0-10)"
                min="0"
                max="10"
              />
              <button className="btn btn-success" type="submit">
                Submit Rating
              </button>
            </form>
          </div>
        </div>
      </div>

      <DynamicLink id={id} type="movies" customPath="cast">
        <h2 className="mb-3 text-primary" style={{ cursor: "pointer" }}>
          Cast
        </h2>
      </DynamicLink>
      {movieCast.length > 0 ? (
        <Carousel
          items={movieCast}
          visibleCount={5}
          renderItem={(castMember) => (
            <DynamicLink id={castMember.nconst} type="people">
              <div className="text-center">
                <img
                  src={castMember.photo}
                  alt={castMember.primaryname}
                  className="rounded mb-2"
                  style={{ width: "150px", height: "200px", objectFit: "cover" }}
                />
                <p className="fw-bold mb-1">{castMember.primaryname}</p>
                <p className="text-muted">{castMember.role || "Unknown Role"}</p>
              </div>
            </DynamicLink>
          )}
        />
      ) : (
        <div className="alert alert-warning">No cast information found.</div>
      )}

      <DynamicLink id={id} type="movies" customPath="similar">
        <h2 className="mt-5 mb-3 text-primary" style={{ cursor: "pointer" }}>
          Similar Movies
        </h2>
      </DynamicLink>
      {similarMovies.length > 0 ? (
        <Carousel
          items={similarMovies}
          visibleCount={5}
          renderItem={(movie) => (
            <DynamicLink id={movie.similar_tconst} type="movies">
              <div className="text-center">
                <img
                  src={movie.poster || "https://via.placeholder.com/150x200"}
                  alt={movie.primarytitle}
                  className="rounded mb-2"
                  style={{ width: "150px", height: "200px", objectFit: "cover" }}
                />
                <p className="fw-bold">{movie.primarytitle}</p>
              </div>
            </DynamicLink>
          )}
        />
      ) : (
        <div className="alert alert-warning">No similar movies found.</div>
      )}
    </div>
  );
};

export default MovieDetail;
