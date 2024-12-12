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
    const [searchTerm, setSearchTerm] = useState(""); // State to track the search term
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Function to fetch people based on search term
    const fetchPeople = async (search = "") => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/NameBasics/topNames100Sub`, {
                params: {
                    substring_filter: search, // Send search term or empty string
                },
            });

            console.log("API Response:", response.data);

            if (!response.data || !Array.isArray(response.data)) {
                throw new Error("Invalid API response");
            }

            const updatedPeople = await Promise.all(
                response.data.map(async (person) => ({
                    ...person,
                    photo: await fetchProfileImage(person.primaryName),
                }))
            );

            setPeople(updatedPeople);
        } catch (err) {
            console.error("Failed to fetch people:", err);
            setError("Failed to load people.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch top actors on initial load
    useEffect(() => {
        fetchPeople(); // Fetch without a search term
    }, []);

    // Handle changes in the search bar
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Update search term state
    };

    // Handle search button click
    const handleSearchClick = () => {
        fetchPeople(searchTerm); // Trigger fetch when search button is clicked
    };

    return (
        <div>
            <h1>Top Actors</h1>
            <p>Welcome to the People page, search and browse your favorite actors and movie crew members here.</p>

            {/* Search Bar and Button */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search for actors..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{
                        width: "50%",
                        padding: "10px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        marginRight: "10px",
                    }}
                />
                <button
                    onClick={handleSearchClick}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        borderRadius: "5px",
                        border: "none",
                        backgroundColor: "#007bff",
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    Search
                </button>
            </div>

            {isLoading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)", // 5 equal-width columns
                    gap: "15px 10px", // Smaller gap: 15px vertically, 10px horizontally
                    maxWidth: "1200px", // Restrict the grid width
                    margin: "0 auto", // Center the container horizontally
                    padding: "20px", // Add space on the sides
                }}
            >

                {people.map((person) => (
                    <Link
                        to={`/people/${person.nConst}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                        key={person.nConst}
                    >
                        <PeopleCard
                            name={person.primaryName}
                            imageUrl={person.photo}
                            rating={person.aRating}
                            birth={person.birthYear}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default People;
