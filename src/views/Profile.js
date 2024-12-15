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
    const [loadingBookmarks, setLoadingBookmarks] = useState(true);
    const [loadingSearchHistory, setLoadingSearchHistory] = useState(true);
    const [errorBookmarks, setErrorBookmarks] = useState(null);
    const [errorSearchHistory, setErrorSearchHistory] = useState(null);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(
                    `http://localhost:7247/api/UserBookmarks/user/${userId}/bookmarksWithTitles`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to load bookmarks');
                }

                const bookmarkData = await response.json();
                setBookmarks(bookmarkData);
            } catch (err) {
                console.error('Error fetching bookmarks:', err);
                setErrorBookmarks(err.message);
            } finally {
                setLoadingBookmarks(false);
            }
        };

        const fetchSearchHistory = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(
                    `http://localhost:7247/api/SearchHis/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to load search history');
                }

                const searchHistoryData = await response.json();
                console.log('Search History Data:', searchHistoryData); 

                

                setSearchHistory(searchHistoryData);
            } catch (err) {
                console.error('Error fetching search history:', err);
                setErrorSearchHistory(err.message);
            } finally {
                setLoadingSearchHistory(false);
            }
        };

        if (userId) {
            fetchBookmarks();
            fetchSearchHistory();
        }
    }, [userId]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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

            <div className="row">
                {/* Bookmarks Section */}
                <div className="col-md-6 mb-4">
                    <h2>Your Bookmarks</h2>
                    {loadingBookmarks ? (
                        <p>Loading bookmarks...</p>
                    ) : errorBookmarks ? (
                        <div className="alert alert-danger">{errorBookmarks}</div>
                    ) : (
                        <div className="card">
                            <div className="card-body">
                                {bookmarks.length > 0 ? (
                                    <ul className="list-group list-group-flush">
                                        {bookmarks.map((bookmark) => (
                                            <li key={bookmark.userBookmarksId} className="list-group-item">
                                                <DynamicLink id={bookmark.tconst} type="movies">
                                                    <strong>{bookmark.primarytitle || 'Unknown Title'}</strong>
                                                </DynamicLink>
                                                <p className="mb-0">{bookmark.note || 'No note provided'}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted">No bookmarks found.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Search History Section */}
                <div className="col-md-6 mb-4">
                    <h2>Your Search History</h2>
                    {loadingSearchHistory ? (
                        <p>Loading search history...</p>
                    ) : errorSearchHistory ? (
                        <div className="alert alert-danger">{errorSearchHistory}</div>
                    ) : (
                        <div className="card">
                            <div className="card-body">
                                {searchHistory.length > 0 ? (
                                    <ul className="list-group list-group-flush">
                                        {searchHistory.map((search, index) => {
                                            let formattedDate = "No Date Provided";
                                                if (search.searchTimeStamp) {
                                                const date = new Date(search.searchTimeStamp);
                                                formattedDate = isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
                                            }
                                            return (
                                                <li key={index} className="list-group-item">
                                                    <strong>{search.searchQuery || "No Query Provided"}</strong> - {formattedDate}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p className="text-muted">No search history found.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
