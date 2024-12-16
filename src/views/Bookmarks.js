import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import DynamicLink from "../components/DynamicLink"; // Import DynamicLink

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useAuth();

  // Fetch bookmarks from the backend
  useEffect(() => {

    const token = localStorage.getItem('token');
    console.log("Token used for fetch:", token);
    console.log("User ID used for fetch:", userId);

    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:7247/api/UserBookmarks/user/${userId}/bookmarksWithTitles', {
            headers: {
                'Authorization': 'Bearer ${token}', // Include the token in the Authorization header
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
          throw new Error("Failed to load bookmarks");
        }

        const bookmarksData = await response.json();
        setBookmarks(bookmarksData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookmarks();
    }
  }, [userId]);

  // Handle removing a bookmark
  const handleRemove = async (bookmarkId) => {
    try {
        const token = localStorage.getItem('token'); // Get the token from localStorage

        const response = await fetch(`http://localhost:7247/api/UserBookmarks/${bookmarkId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                'Content-Type': 'application/json',
            },
        });

      if (!response.ok) {
        throw new Error("Failed to remove bookmark");
      }

      // Update the bookmarks state after successful deletion
      setBookmarks(bookmarks.filter((bookmark) => bookmark.userBookmarksId !== bookmarkId));
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Your Bookmarks</h2>
      <div className="bookmarks-list">
        {bookmarks.length > 0 ? (
          bookmarks.map((bookmark) => (
            <div key={bookmark.userBookmarksId} className="bookmark-card">
                <img
                    src={bookmark.poster || "https://placehold.co/150x200"}
                    alt={bookmark.primaryTitle}
                    className="poster"
                />
              <div className="details">
                <h3>
                  <DynamicLink id={bookmark.tconst} type="movies">
                    {bookmark.primarytitle || "Unknown Title"}
                  </DynamicLink>
                </h3>
                <p><strong>Note:</strong> {bookmark.note || "No note provided"}</p>
                <button onClick={() => handleRemove(bookmark.userBookmarksId)} className="remove-button">
                  Remove Bookmark
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No bookmarks found.</p>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
