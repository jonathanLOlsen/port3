import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, TMDB_API_KEY, TMDB_BASE_URL } from "../config/Config";
import DynamicLink from "../components/DynamicLink";
import "./PersonDetail.css"; // Import the CSS file

const PersonDetail = () => {
    const { nConst } = useParams();
    const [person, setPerson] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPersonDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/NameBasics/details/${nConst}`);
                const personData = response.data;

                const profileImage = await fetchProfileImage(personData.primaryName);

                setPerson({
                    ...personData,
                    photo: profileImage,
                });
            } catch (err) {
                console.error("Failed to fetch person details:", err);
                setError("Failed to load person details.");
            } finally {
                setLoading(false);
            }
        };

        const fetchProfileImage = async (name) => {
            try {
                const response = await axios.get(`${TMDB_BASE_URL}/search/person`, {
                    params: {
                        api_key: TMDB_API_KEY,
                        query: name,
                    },
                });

                const person = response.data.results[0];
                if (person && person.profile_path) {
                    return `https://image.tmdb.org/t/p/w200${person.profile_path}`;
                }
            } catch (error) {
                console.error(`Failed to fetch TMDB profile for ${name}:`, error);
            }

            return "https://via.placeholder.com/150x200";
        };

        fetchPersonDetails();
    }, [nConst]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error-text">{error}</p>;

    return (
        <div className="person-detail-container">
            {/* Main Content */}
            <div className="person-main-content">
                {/* Person Column */}
                <div className="person-column">
                    <h1 className="person-name">{person.primaryName}</h1>
                    <img
                        src={person.photo}
                        alt={person.primaryName}
                        className="person-image"
                    />
                </div>
    
                {/* Center Information */}
                <div className="person-info">
                    <div className="rating-birth-container">
                        <p><strong>Rating:</strong> {person.aRating || "N/A"}</p>
                        <p><strong>Birth Year:</strong> {person.birthYear || "Unknown"}</p>
                    </div>
                    <p><strong>Primary Profession:</strong> {person.primaryProfession || "Not available"}</p>
                </div>
    
                {/* Poster Column */}
                <div className="poster-column">
                    <p className="known-for-title">Known For Title:</p>
                    <DynamicLink id={person.tConst} type="movies">
                        <img
                            src={person.poster}
                            alt={`${person.primaryName} Poster`}
                            className="poster-image"
                        />
                    </DynamicLink>
                </div>
            </div>
    
            {/* Back Button */}
            <button onClick={() => window.history.back()}>Go Back</button>
        </div>
    );
    
    
    
    
};

export default PersonDetail;
