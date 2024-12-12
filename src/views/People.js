import "bootstrap/dist/css/bootstrap.min.css";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, TMDB_API_KEY, TMDB_BASE_URL } from "../config/Config";
import PeopleCard from "../components/PeopleCard";
import { Link } from "react-router-dom";

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
    <div className="container my-5">
      <h1 className="text-center mb-4 display-4">Top Actors</h1>
      <p className="text-center text-muted">
        Welcome to the People page. Search and browse your favorite actors and movie crew members here.
      </p>

      {/* Search Section */}
      <div className="d-flex justify-content-center mb-4">
        <div className="input-group w-50">
          <input
            type="text"
            placeholder="Search for actors..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control"
          />
          <button
            onClick={handleSearchClick}
            className="btn btn-primary"
            type="button"
          >
            Search
          </button>
        </div>
      </div>

      {/* Loading/Error Message */}
      {isLoading && <p className="text-center text-muted">Loading...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {/* People Grid */}
      <div className="row g-4">
        {people.map((person) => (
          <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={person.nConst}>
            <Link to={`/people/${person.nConst}`} className="text-decoration-none">
              <PeopleCard
                name={person.primaryName}
                imageUrl={person.photo}
                rating={person.aRating}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default People;
