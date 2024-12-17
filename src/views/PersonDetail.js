import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, TMDB_API_KEY, TMDB_BASE_URL } from "../config/Config";
import DynamicLink from "../components/DynamicLink";

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
          params: { api_key: TMDB_API_KEY, query: name },
        });
        const person = response.data.results[0];
        return person?.profile_path
          ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
          : "https://via.placeholder.com/150x200";
      } catch (error) {
        console.error(`Failed to fetch TMDB profile for ${name}:`, error);
        return "https://via.placeholder.com/150x200";
      }
    };

    fetchPersonDetails();
  }, [nConst]);

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center align-items-start">
        {/* Left Column - Profile Image */}
        <div className="col-md-4 text-center mb-3">
          <img
            src={person.photo}
            alt={person.primaryName}
            className="img-fluid rounded shadow"
          />
        </div>

        {/* Center Column - Details */}
        <div className="col-md-4">
          <h1 className="text-center mb-4">{person.primaryName}</h1>
          <p>
            <strong>Rating:</strong> {person.aRating || "N/A"}
          </p>
          <p>
            <strong>Birth Year:</strong> {person.birthYear || "Unknown"}
          </p>
          <p>
            <strong>Primary Profession:</strong> {person.primaryProfession || "Not available"}
          </p>
          <p>
            <strong>Known For Titles:</strong>{" "}
            {person.knownForTitles && person.tConst
              ? person.knownForTitles.split(",").map((title, index) => (
                  <React.Fragment key={index}>
                    <DynamicLink id={person.tConst.split(",")[index]?.trim()} type="movies">
                      {title.trim()}
                    </DynamicLink>
                    {index < person.knownForTitles.split(",").length - 1 ? ", " : ""}
                  </React.Fragment>
                ))
              : "No titles available"}
          </p>
        </div>

        {/* Right Column - Poster */}
        <div className="col-md-4 text-center mb-3">
        {person.tConst && (
            <DynamicLink id={person.tConst.split(",")[0]?.trim()} type="movies">
            <img
                src={person.poster || "https://via.placeholder.com/300"}
                alt={`${person.primaryName} Poster`}
                className="img-fluid rounded shadow"
            />
            </DynamicLink>
        )}
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center mt-4">
        <button className="btn btn-outline-secondary" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default PersonDetail;
