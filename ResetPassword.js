import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./Reset.css"; // new separate CSS

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const email = localStorage.getItem("resetEmail");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/reset-password/", {
        email,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      Swal.fire("Success", "Password reset successful !", "success");
      localStorage.removeItem("resetEmail");
      navigate("/login");
    } catch (error) {
      Swal.fire("Error", "Password reset failed", "error");
    }
  };

  return (
    <div className="reset-page">
      <h2 className="reset-heading">Reset Your Password</h2>
      <div className="reset-container">
        <form onSubmit={handleSubmit}>
          <div className="reset-input-icon">
            <span className="reset-icon">🔒</span>
            <input
              type="password"
              required
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="reset-input-icon">
            <span className="reset-icon">🔒</span>
            <input
              type="password"
              required
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="reset-button">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
