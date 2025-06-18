import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./Forgot.css"; // new CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/send-otp/", { email });
      localStorage.setItem("resetEmail", email);
      Swal.fire("Success", "OTP sent to your email !", "success");
      navigate("/verify-otp");
    } catch (error) {
      Swal.fire("Error", "Failed to send OTP. Check email.", "error");
    }
  };

  return (
    <div className="forgot-page">
      <h2 className="forgot-heading">Forgot Password</h2>
      <div className="forgot-container">
        <form onSubmit={handleSubmit}>
          <div className="forgot-input-icon">
            <span className="forgot-icon">@</span>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="forgot-button">Send OTP</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
