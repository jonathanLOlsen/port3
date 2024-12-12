import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [error, setError] = useState('');
    const { token, username } = useAuth();

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        try {
            const response = await axios.get('http://localhost:7247/api/UserBookmarks', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBookmarks(response.data.items);
        } catch (err) {
            console.error('Failed to fetch bookmarks:', err);
            setError('Failed to load bookmarks.');
        }
    };

    const handleDelete = async (bookmarkId) => {
        try {
            await axios.delete(`http://localhost:7247/api/UserBookmarks/${bookmarkId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBookmarks(bookmarks.filter((bookmark) => bookmark.userBookmarksId !== bookmarkId));
        } catch (err) {
            console.error('Failed to delete bookmark:', err);
            setError('Failed to delete bookmark.');
        }
    };

    return (
        <div>
            <h2>{username}'s Bookmarks</h2>
            {error && <p className="error">{error}</p>}
            <ul>
                {bookmarks.length > 0 ? (
                    bookmarks.map((bookmark) => (
                        <li key={bookmark.userBookmarksId}>
                            <span>{bookmark.tConst}</span> - <span>{bookmark.note}</span>
                            <button onClick={() => handleDelete(bookmark.userBookmarksId)}>Delete</button>
                        </li>
                    ))
                ) : (
                    <p>No bookmarks found.</p>
                )}
            </ul>
        </div>
    );
};

export default Bookmarks;
