import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, TMDB_API_KEY, TMDB_BASE_URL } from "../config/Config";
import PeopleCard from "../components/PeopleCard";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

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
      <h1 className="text-center mb-4">Top Actors</h1>
      <p className="text-center mb-5">
        Welcome to the People page, search and browse your favorite actors and movie crew members here.
      </p>

      {/* Search Bar */}
      <div className="mb-5 d-flex justify-content-center">
        <div className="input-group" style={{ maxWidth: "600px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search for actors..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="btn btn-primary" onClick={handleSearchClick}>
            Search
          </button>
        </div>
      </div>

      {isLoading && <div className="text-center">Loading...</div>}
      {error && <div className="text-danger text-center">{error}</div>}

      {/* People Grid */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {people.map((person) => (
          <div key={person.nConst} className="col">
            <Link to={`/people/${person.nConst}`} className="text-decoration-none">
              <div className="card h-100 shadow-lg">
                <img
                  src={person.photo}
                  className="card-img-top"
                  alt={person.primaryName}
                  style={{ height: "300px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title mb-2">{person.primaryName}</h5>
                  <p className="card-text text-muted">
                    <strong>Rating:</strong> {person.aRating || "N/A"}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default People;
