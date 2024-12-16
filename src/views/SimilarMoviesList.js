import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config/Config";
import "./People.css"; // Reuse styling for grid
import DynamicLink from "../components/DynamicLink";

const SimilarMoviesList = () => {
    const { id } = useParams();
    const [similarMovies, setSimilarMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSimilarMovies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/TitleBasics/similar-movies`,
                    { params: { tconst: id } }
                );

                // Log the response for debugging
                console.log("Fetched similar movies:", response.data);

                setSimilarMovies(response.data || []); // Ensure array fallback
            } catch (err) {
                console.error("Failed to load similar movies:", err);
                setError("Failed to load similar movies.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSimilarMovies();
    }, [id]);

    return (
        <div className="people-container">
            <h1>Similar Movies</h1>
            {isLoading && <p>Loading...</p>}
            {error && <p className="error-text">{error}</p>}
            <div className="people-grid">
                {similarMovies.length > 0 ? (
                    similarMovies
                        .filter((movie) => movie && movie.similar_tconst) // Filter invalid data
                        .map((movie) => (
                            <DynamicLink key={movie.similar_tconst} id={movie.similar_tconst} type="movies">
                            <div
                                key={movie.similar_tconst}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    width: "150px",
                                    margin: "10px",
                                }}
                            >
                                <img
                                    src={movie.poster || "https://via.placeholder.com/150x200"}
                                    alt={movie.primarytitle || "No Title"}
                                    style={{
                                        width: "150px",
                                        height: "200px",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                    }}
                                />
                                <h3 style={{ fontSize: "16px", margin: "10px 0" }}>
                                    {movie.primarytitle || "Untitled"}
                                </h3>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        color: "#666",
                                        textAlign: "center",
                                    }}
                                >
                                    {movie.plot && movie.plot.length > 100
                                        ? movie.plot.substring(0, 100) + "..."
                                        : movie.plot || "No Plot Available"}
                                </p>
                            </div>
                        </DynamicLink>
                        ))
                ) : (
                    !isLoading && <p>No similar movies found.</p>
                )}
            </div>
        </div>
    );
};

export default SimilarMoviesList;
