import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, TMDB_API_KEY, TMDB_BASE_URL } from "../config/Config";
import PeopleCard from "../components/PeopleCard";
import { Link } from "react-router-dom";

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

const People = () => {
    const [people, setPeople] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPeople = async () => {
            try {
                // Fetch data from your API
                const response = await axios.get(`${API_BASE_URL}/NameBasics/topNames100`);

                // Enhance data with TMDB images
                const updatedPeople = await Promise.all(
                    response.data.map(async (person) => ({
                        ...person,
                        photo: await fetchProfileImage(person.primaryName), // Fetch photo
                    }))
                );

                setPeople(updatedPeople);
            } catch (err) {
                console.error("Failed to fetch people:", err);
                setError("Failed to load people.");
            }
        };

        fetchPeople();
    }, []);

    return (
        <div>
            <h1>Top Actors</h1>
            <p>Welcome to the People page, search and browse your favorite actors and movie crew members here.</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {people.map((person) => (
                    <Link
                        to={`/people/${person.nConst}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                        key={person.nConst}
                    >
                        <PeopleCard
                            name={person.primaryName} // Corrected casing
                            imageUrl={person.photo} // Image from TMDB or placeholder
                            rating={person.aRating}
                            birth={person.birthYear} // Corrected casing
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default People;
