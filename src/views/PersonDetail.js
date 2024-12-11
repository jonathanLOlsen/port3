import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, TMDB_API_KEY, TMDB_BASE_URL } from "../config/Config";

const PersonDetail = () => {
    const { nConst } = useParams(); // Get the nConst from the URL
    const [person, setPerson] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchPersonDetails = async () => {
            setLoading(true); // Set loading to true at the start of the fetch
            try {
                // Fetch person details from your API
                const response = await axios.get(`${API_BASE_URL}/NameBasics/details/${nConst}`);
                const personData = response.data;

                // Fetch TMDB image
                const profileImage = await fetchProfileImage(personData.primaryName);

                setPerson({
                    ...personData,
                    photo: profileImage,
                });
            } catch (err) {
                console.error("Failed to fetch person details:", err);
                setError("Failed to load person details.");
            } finally {
                setLoading(false); // Stop loading after the fetch
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

            return "https://via.placeholder.com/150x200"; // Default placeholder image
        };

        fetchPersonDetails();
    }, [nConst]);

    if (loading) return <p>Loading...</p>; // Display a loading message
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>{person.primaryName}</h1>
            <img
                src={person.photo}
                alt={person.primaryName}
                style={{ borderRadius: "8px", width: "200px", height: "300px" }}
            />
            <p><strong>Rating:</strong> {person.aRating || "N/A"}</p>
            <p><strong>Birth Year:</strong> {person.birthYear || "Unknown"}</p>
            <p><strong>Known For:</strong> {person.knownForTitles || "Not available"}</p>
            <p><strong>Primary Profession:</strong> {person.primaryProfession || "Not available"}</p>
        </div>
    );
};

export default PersonDetail;
