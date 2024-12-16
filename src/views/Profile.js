import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import DynamicLink from '../components/DynamicLink';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const { username, userId, logout } = useAuth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data (bookmarks and search history)
  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching profile data for userId:', userId);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found in localStorage');
          setError('Authentication token missing');
          setLoading(false);
          return;
        }

        console.log('Token:', token);

        // Fetch bookmarks
        console.log('Fetching bookmarks...');
        const bookmarkResponse = await fetch(
          `http://localhost:7247/api/UserBookmarks/user/${userId}/bookmarksWithTitles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!bookmarkResponse.ok) {
          console.error('Failed to fetch bookmarks:', bookmarkResponse.status, bookmarkResponse.statusText);
          setError('Failed to load bookmarks');
        } else {
          const bookmarkData = await bookmarkResponse.json();
          console.log('Bookmark data received:', bookmarkData);
          setBookmarks(bookmarkData);
        }

        // Fetch search history
        console.log('Fetching search history...');
        const searchHistoryResponse = await fetch(
          `http://localhost:7247/api/SearchHis/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!searchHistoryResponse.ok) {
          console.error('Failed to fetch search history:', searchHistoryResponse.status, searchHistoryResponse.statusText);
          setError('Failed to load search history');
        } else {
          const searchHistoryData = await searchHistoryResponse.json();
          console.log('Search history data received:', searchHistoryData);
          setSearchHistory(searchHistoryData);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      console.warn('userId is null or undefined. Skipping data fetch.');
      setLoading(false);
    }
  }, [userId]);

  // Handle logout
  const handleLogout = () => {
    console.log('User logging out...');
    logout();
    navigate('/login');
  };

  // Handle remove bookmark
  const handleRemoveBookmark = async (userBookmarksId) => {
    console.log('Attempting to remove bookmark with ID:', userBookmarksId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7247/api/UserBookmarks/${userBookmarksId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to remove bookmark: ${response.status} ${response.statusText}`);
      }

      // Filter out the removed bookmark
      setBookmarks(bookmarks.filter((bookmark) => bookmark.userBookmarksId !== userBookmarksId));
      console.log('Bookmark removed successfully:', userBookmarksId);
    } catch (err) {
      console.error('Error removing bookmark:', err);
    }
  };

  useEffect(() => {
    console.log('Bookmarks updated:', bookmarks);
  }, [bookmarks]);

  if (loading) {
    console.log('Loading profile data...');
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">Hello, {username}</h1>
      <div className="mb-4">
        <button className="btn btn-primary me-2" onClick={() => navigate('/update-profile')}>
          Update Profile
        </button>
        <button className="btn btn-danger" onClick={handleLogout}>
          Log out
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {/* Bookmarks Section */}
        <div className="col-md-6 mb-4">
          <h2>Your Bookmarks</h2>
          <div className="card">
            <div className="card-body">
              {bookmarks.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {bookmarks.map((bookmark) => (
                    <li key={bookmark.userBookmarksId} className="list-group-item">
                      <DynamicLink id={bookmark.tConst} type="movies">
                        <strong>{bookmark.primaryTitle}</strong>
                      </DynamicLink>
                      <p>{bookmark.note || 'No note added.'}</p>
                      <button
                        className="btn btn-sm btn-danger mt-2"
                        onClick={() => handleRemoveBookmark(bookmark.userBookmarksId)}
                      >
                        Remove Bookmark
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No bookmarks found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Search History Section */}
        <div className="col-md-6 mb-4">
          <h2>Your Search History</h2>
          <div className="card">
            <div className="card-body">
              {searchHistory.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {searchHistory.map((search, index) => (
                    <li key={index} className="list-group-item">
                      <strong>{search.searchQuery}</strong> -{' '}
                      {new Date(search.searchTimeStamp).toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No search history found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
