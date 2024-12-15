import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const { userId, username, email } = useAuth();
  const navigate = useNavigate();
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7247/api/Users/${userId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername, email: newEmail, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setSuccess('Profile updated successfully');
      navigate('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Update Profile</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Username</label>
          <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit">Update</button>
        <button type="button" onClick={() => navigate('/profile')}>Cancel</button>
      </form>
    </div>
  );
};

export default UpdateProfile;
