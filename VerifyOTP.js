// src/components/VerifyOTP.js

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./VerifyOTP.css";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/, "");
    if (!value) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleResend = () => {
    setOtp(new Array(6).fill(""));
    setTimer(30);
    setCanResend(false);
    Swal.fire("OTP Sent", "A new OTP has been sent to your email.", "info");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    try {
      await axios.post("http://localhost:8000/api/verify-otp/", {
        email,
        otp: finalOtp,
      });
      Swal.fire("Verified", "OTP verified successfully !", "success");
      navigate("/reset-password");
    } catch (error) {
      Swal.fire("Error", "Invalid OTP", "error");
    }
  };

  return (
    <div className="otp-wrapper">
      <h2 className="otp-main-heading">OTP Verification</h2>
      <div className="otp-card">
        <p className="otp-subtext">
          Enter the code sent to <strong>{email}</strong>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={digit ? "filled" : ""}
              />
            ))}
          </div>
          <div className="otp-timer">
            {canResend ? (
              <span className="resend-text" onClick={handleResend}>
                Didn’t receive the OTP ? <strong>RESEND</strong>
              </span>
            ) : (
              <span>Resend available in 00 : {timer < 10 ? `0${timer}` : timer}</span>
            )}
          </div>
          <button className="submit-btn" type="submit">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;
