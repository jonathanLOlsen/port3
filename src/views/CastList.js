import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DynamicLink from "../components/DynamicLink";
import { TMDB_API_KEY, TMDB_BASE_URL, API_BASE_URL } from "../config/Config";

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
    <div className="container my-5">
      <h1 className="text-center mb-4">Movie Cast</h1>
      {isLoading && <p className="text-center">Loading...</p>}
      {error && <p className="text-danger text-center">{error}</p>}
      <div className="row g-4 justify-content-center">
        {cast.map((person) => (
          <div key={person.nconst} className="col-6 col-sm-4 col-md-3 col-lg-2">
            <DynamicLink id={person.nconst} type="people">
              <div className="card h-100 text-center shadow-sm">
                <img
                  src={person.photo || "https://via.placeholder.com/150x200"}
                  alt={person.primaryname || "Unknown Name"}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title" style={{ fontSize: "1rem" }}>
                    {person.primaryname || "Unknown Name"}
                  </h5>
                  <p className="card-text text-muted" style={{ fontSize: "0.9rem" }}>
                    {person.role || "No Role Available"}
                  </p>
                </div>
              </div>
            </DynamicLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastList;
