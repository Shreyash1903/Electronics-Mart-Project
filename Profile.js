import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({ full_name: '', email: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile :', error);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.put('http://localhost:8000/api/profile/', profile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated !',
        text: 'Your profile has been successfully updated.',
        confirmButtonColor: '#000000',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was an error updating your profile.',
      });
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">{profile.full_name?.charAt(0)}</div>
        <h2>Your Profile</h2>
      </div>

      <form onSubmit={handleProfileSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="full_name"
            value={profile.full_name}
            onChange={handleProfileChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            required
          />
        </div>

        <button type="submit" className="profile-btn">Update Profile</button>
      </form>

      <div className="change-password-link">
        <p>
          Want to change your password ?{' '}
          <Link to="/change-password">Click here</Link>
        </p>
      </div>
    </div>
  );
};

export default Profile;
