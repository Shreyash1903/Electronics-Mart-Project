import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Profile.css'; // Assuming same styling

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(
        'http://localhost:8000/api/update-password/',
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: 'success',
        title: 'Password Updated !',
        text: 'Your password has been successfully changed.',
        confirmButtonColor: '#000000',
      });

      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Check your current password or try again later.',
      });
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Change Password</h2>
      </div>

      <form onSubmit={handlePasswordSubmit}>
        <div className="form-group">
          <label>Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            placeholder="Enter current password"
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter new password"
          />
        </div>
        <button type="submit" className="profile-btn">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
