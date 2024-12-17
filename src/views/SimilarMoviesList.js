import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config/Config";
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

                console.log("Fetched similar movies:", response.data);
                setSimilarMovies(response.data || []);
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
        <div className="container my-5">
            <h1 className="mb-4 text-center">Similar Movies</h1>
            {isLoading && <p className="text-center">Loading...</p>}
            {error && <p className="alert alert-danger text-center">{error}</p>}

            <div className="row gy-4 justify-content-center">
                {similarMovies.length > 0 ? (
                    similarMovies
                        .filter((movie) => movie && movie.similar_tconst)
                        .map((movie) => (
                            <div key={movie.similar_tconst} className="col-6 col-md-4 col-lg-3">
                                <DynamicLink id={movie.similar_tconst} type="movies">
                                    <div className="card h-100 text-center shadow">
                                        <img
                                            src={movie.poster || "https://via.placeholder.com/150x200"}
                                            alt={movie.primarytitle || "No Title"}
                                            className="card-img-top"
                                            style={{ objectFit: "cover", height: "200px" }}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title text-truncate">{movie.primarytitle || "Untitled"}</h5>
                                            <p className="card-text small text-muted">
                                                {movie.plot && movie.plot.length > 100
                                                    ? movie.plot.substring(0, 100) + "..."
                                                    : movie.plot || "No Plot Available"}
                                            </p>
                                        </div>
                                    </div>
                                </DynamicLink>
                            </div>
                        ))
                ) : (
                    !isLoading && <p className="text-center">No similar movies found.</p>
                )}
            </div>
        </div>
    );
};

export default SimilarMoviesList;
