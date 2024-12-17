import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DynamicLink from "../components/DynamicLink";
import { TMDB_API_KEY, TMDB_BASE_URL, API_BASE_URL } from "../config/Config";
import "./People.css"; // Reuse People styling

const fetchProfileImage = async (name) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/person`, {
            params: { api_key: TMDB_API_KEY, query: name },
        });
        const person = response.data.results[0];
        return person?.profile_path
            ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
            : "https://via.placeholder.com/150x200";
    } catch {
        return "https://via.placeholder.com/150x200";
    }
};

const CastList = () => {
    const { id } = useParams();
    const [cast, setCast] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCast = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/TitleBasics/movie-cast`,
                    { params: { tconst: id } }
                );
                const updatedCast = await Promise.all(
                    response.data.map(async (member) => ({
                        ...member,
                        photo: await fetchProfileImage(member.primaryname),
                    }))
                );
                setCast(updatedCast);
            } catch (err) {
                console.error("Failed to load cast:", err);
                setError("Failed to load cast.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCast();
    }, [id]);

    return (
        <div className="people-container">
            <h1>Movie Cast</h1>
            {isLoading && <p>Loading...</p>}
            {error && <p className="error-text">{error}</p>}
            <div className="people-grid">
                {cast.map((person) => (
                    <DynamicLink key={person.nconst} id={person.nconst} type="people">
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                width: "150px",
                                margin: "10px",
                                cursor: "pointer", // Indicate it's clickable
                            }}
                        >
                            <img
                                src={person.photo || "https://via.placeholder.com/150x200"}
                                alt={person.primaryname || "Unknown Name"}
                                style={{
                                    width: "150px",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                }}
                            />
                            <h3 style={{ fontSize: "16px", margin: "10px 0" }}>
                                {person.primaryname || "Unknown Name"}
                            </h3>
                            <p style={{ fontSize: "14px", color: "#666" }}>
                                {person.role || "No Role Available"}
                            </p>
                        </div>
                    </DynamicLink>
                ))}
            </div>
        </div>
    );
};

export default CastList;
