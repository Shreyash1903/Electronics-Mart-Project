import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import GoogleLoginButton from "./GoogleLoginButton";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      Swal.fire({
      title: "Account Created Successfully !",
      text: "Please log in.",
      icon: "success",
      confirmButtonText: "Go to Login",
    }).then(() => {
      navigate("/login", {
        replace: true,
        state: { from: "/home" }, // ⬅️ this clears previous /products redirect
      });
    });
    } else {
      const data = await res.json();
      Swal.fire({
        title: "Signup Failed",
        text: data?.detail || "Please try again.",
        icon: "error",
      });
    }
  };

  return (
    <div className="signup-page">
      {/* Left Panel */}
      <div className="signup-left-panel">
        <h2>Power Up Your Shopping !</h2>
        <p>
          Join Electronics Mart today and unlock access to the latest gadgets,
          exclusive member-only deals, and fast, secure shopping from the most
          trusted brands in the tech world.
        </p>
        <button className="auth-switch-btn" onClick={() => navigate("/login")}>
          Already a member ? Sign in.
        </button>
      </div>

      {/* Right Form Panel */}
      <div className="signup-right-panel">
        <div className="signup-form-content">
          <h2 className="signup-heading">Create Account</h2>
          <div className="signup-form-container">
            <form onSubmit={handleSubmit}>
              <div className="input-icon">
                <FontAwesomeIcon icon={faUser} className="icon" />
                <input
                  type="text"
                  id="full_name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-icon">
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-icon">
                <FontAwesomeIcon icon={faLock} className="icon" />
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button type="submit">Sign Up</button>

              <p className="toggle-link">
                Already have an account ?{" "}
                <span onClick={() => navigate("/login")}>Login</span>
              </p>

              <p className="or-separator">or</p>

              <GoogleLoginButton isSignup={true} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
