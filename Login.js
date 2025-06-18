import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import GoogleLoginButton from "./GoogleLoginButton";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const rawFrom = location.state?.from;
  const from = rawFrom === "/login" ? "/" : rawFrom || "/home";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect to homepage if already logged in
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        email: formData.email,
        password: formData.password,
      });

      const { access, refresh } = response.data;

      if (!access || !refresh) {
        throw new Error("Missing tokens from response");
      }

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      console.log("Redirecting to :", from); // helpful debug log

      Swal.fire({
        title: "Login Successful !",
        text: "Welcome back !",
        icon: "success",
        confirmButtonText: "Go to Home Page",
      }).then(() => {
        navigate(from, { replace: true });
      });
    } catch (error) {
      Swal.fire({
        title: "Login Failed",
        text: error.response?.data?.detail || "Invalid email or password",
        icon: "error",
      });
    }
  };

  return (
    <div className="login-layout">
      <div className="left-panel">
        <h1>Welcome to Electronics Mart !</h1>
        <p>
          Discover a wide range of high-quality electronics at unbeatable prices.
          We bring you the best from the top global brands with a seamless shopping experience.
        </p>
        <div className="brand-section">
          <h3>Top Brands We Offer :</h3>
          <ul className="brand-list">
            <li>
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" /> Apple
            </li>
            <li>
              <img src="https://th.bing.com/th/id/R.9931d3f39fbdb9b938662d63c51ceab0?rik=1JdVvDOkdHGDpA&riu=http%3a%2f%2fcdn.wallpapersafari.com%2f80%2f15%2fX8QGrT.jpg&ehk=8YN3Dwd8apZsZ0fkwn37DCKnNAngs9lniLlKKF4eT8E%3d&risl=&pid=ImgRaw&r=0" alt="HP" /> HP
            </li>
            <li>
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" alt="Samsung" /> Samsung
            </li>
            <li>
              <img src="https://logos-world.net/wp-content/uploads/2021/12/Amazfit-New-Logo-700x394.png" alt="Amazfit" /> Amazfit
            </li>
            <li>
              <img src="https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png" alt="Sony" /> Sony
            </li>
            <li>
              <img src="https://static.vecteezy.com/system/resources/previews/020/190/413/original/canon-logo-canon-icon-free-free-vector.jpg" alt="Canon" /> Canon
            </li>
            <li>
              <img src="https://th.bing.com/th/id/OIP._si4va_1MybkM60kxMFoJwHaD6?r=0&rs=1&pid=ImgDetMain" alt="LG" /> LG
            </li>
            <li>
              <img src="https://th.bing.com/th/id/OIP.l2F9_i_vWMiqV5SrXlHRNQHaEK?r=0&rs=1&pid=ImgDetMain" alt="Logitech" /> Logitech
            </li>
            <li>
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg" alt="Xiaomi" /> Xiaomi
            </li>
          </ul>
        </div>
        <p>
          Whether you're looking for the latest smartphones, powerful laptops, stylish wearables,
          or smart home devices, we've got you covered.
        </p>
      </div>

      <div className="right-panel">
        <div className="login-page">
          <h2 className="login-heading">Login</h2>
          <AuthCard>
            <form onSubmit={handleSubmit}>
              <div className="input-icon">
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="input-icon">
                <FontAwesomeIcon icon={faLock} className="icon" />
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
              </div>

              <p style={{ textAlign: "right", marginBottom: "10px" }}>
                <span
                  style={{
                    color: "#007bff",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </span>
              </p>

              <button type="submit">Login</button>

              <p>
                Don't have an account ?{" "}
                <span
                  style={{ color: "#000", cursor: "pointer" }}
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </span>
              </p>

              <p style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>or</p>

              <GoogleLoginButton isSignup={false} />
            </form>
          </AuthCard>
        </div>
      </div>
    </div>
  );
};

const AuthCard = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="auth-form">{children}</div>
    </div>
  );
};

export default Login;
