import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Swal from "sweetalert2";

const GoogleLoginButton = ({ isSignup = false }) => {
  const [loginKey, setLoginKey] = useState(Date.now());
  const endpoint = isSignup ? "google-signup" : "google-login";
  const buttonText = isSignup ? "signup_with" : "signin_with"; // ✅ Dynamic Google text

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    console.log(`🪪 Google ID Token (${isSignup ? "Signup" : "Login"}):`, token);

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/auth/${endpoint}/`, {
        token,
      });

      const { access, refresh, user } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      Swal.fire({
        title: isSignup ? "Account Created Successfully !" : "Login Successful !",
        text: `Welcome , ${user.name || user.email}`,
        icon: "success",
        confirmButtonText: "Go to Home Page",
      }).then(() => {
        window.location.href = "/home";
      });
    } catch (error) {
      Swal.fire({
        title: isSignup ? "Signup Failed" : "Login Failed",
        text: error.response?.data?.error || "Something went wrong",
        icon: "error",
      });
    } finally {
      setLoginKey(Date.now()); // 🔁 Remount GoogleLogin for new token
    }
  };

  return (
    <GoogleLogin
      key={loginKey}
      onSuccess={handleSuccess}
      onError={() => {
        Swal.fire("Google Auth Failed", "Unable to authenticate with Google.", "error");
        setLoginKey(Date.now());
      }}
      useOneTap={false}
      text={buttonText} // ✅ Dynamically set button label
      promptMomentNotification={(notice) => {
        console.log("📢 Google Prompt Notice :", notice);
      }}
    />
  );
};

export default GoogleLoginButton;
