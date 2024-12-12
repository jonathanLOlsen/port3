import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';


const Bookmarks = () => {
    const { userId } = useAuth(); // Retrieve userId from AuthContext
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                if (!userId) {
                    throw new Error('User ID is missing');
                }

                const response = await fetch(`http://localhost:7247/api/UserBookmarks/user/${userId}/bookmarksWithTitles`);

                if (!response.ok) {
                    throw new Error('Failed to fetch bookmarks');
                }

                const data = await response.json();
                setBookmarks(data);
            } catch (err) {
                setError(err.message);
            } finally{
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, [userId]);

    if (loading) {
        return <div>Loading bookmarks...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Your Bookmarks</h2>
            {bookmarks.length === 0 ? (
                <p>No bookmarks found.</p>
            ) : (
                <ul>
                    {bookmarks.map((bookmark) => (
                        <li key={bookmark.userBookmarkingsId}>
                            <strong>{bookmark.primarytitle}</strong> ({bookmark.tconst}) - {bookmark.note}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Bookmarks;
