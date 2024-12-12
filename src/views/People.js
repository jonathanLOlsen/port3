import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, TMDB_API_KEY, TMDB_BASE_URL } from "../config/Config";
import PeopleCard from "../components/PeopleCard";
import { Link } from "react-router-dom";
import "./People.css"; // Import the CSS file

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

const People = () => {
    const [people, setPeople] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchPeople = async (search = "") => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/NameBasics/topNames100Sub`, {
                params: {
                    substring_filter: search,
                },
            });

            if (!response.data || !Array.isArray(response.data)) {
                throw new Error("Invalid API response");
            }

            const updatedPeople = await Promise.all(
                response.data.map(async (person) => {
                    const photo = await fetchProfileImage(person.primaryName);
                    return {
                        ...person,
                        photo,
                    };
                })
            );

            setPeople(updatedPeople);
        } catch (err) {
            console.error("Failed to fetch people:", err);
            setError("Failed to load people.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPeople();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchClick = () => {
        fetchPeople(searchTerm);
    };

    return (
        <div className="people-container">
            <h1>Top Actors</h1>
            <p>Welcome to the People page, search and browse your favorite actors and movie crew members here.</p>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search for actors..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <button onClick={handleSearchClick} className="search-button">
                    Search
                </button>
            </div>

            {isLoading && <p>Loading...</p>}
            {error && <p className="error-text">{error}</p>}

            <div className="people-grid">
                {people.map((person) => (
                    <Link
                        to={`/people/${person.nConst}`}
                        className="person-link"
                        key={person.nConst}
                    >
                        <PeopleCard
                            name={person.primaryName}
                            imageUrl={person.photo}
                            rating={person.aRating}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default People;
