import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import './EditAddress.css';

const EditAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const address = location.state?.address;

  const [formData, setFormData] = useState({
    name: "",
    mobile_number: "",
    alternate_mobile_number: "",
    address: "",          // previously 'street'
    locality: "",
    city: "",
    state: "",
    pincode: "",          // previously 'postal_code'
    landmark: "",
    country: "",
  });

  useEffect(() => {
    if (address) {
      setFormData({
        name: address.name || "",
        mobile_number: address.mobile_number || "",
        alternate_mobile_number: address.alternate_mobile_number || "",
        address: address.address || "",
        locality: address.locality || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
        landmark: address.landmark || "",
        country: address.country || "",
      });
    }
  }, [address]);

  useEffect(() => {
    if (!address) {
      navigate("/checkout");
    }
  }, [address, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    if (!token) {
      Swal.fire("Error", "You must be logged in", "error");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8000/api/addresses/${address.id}/`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Success", "Address updated successfully !", "success");
      navigate("/checkout");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update address", "error");
    }
  };

  if (!address) return null;

  return (
    <>
      <h1 className="edit-title">Edit Address</h1>
      <div className="edit-page">
        <div className="edit-content">
          <form className="edit-form" onSubmit={handleSubmit}>
            <div className="edit-form-row">
              <label>
                Name <span className="required">*</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="edit-form-input"
                  placeholder="Full Name"
                />
              </label>
              <label>
                Mobile Number <span className="required">*</span>
                <input
                  type="tel"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  required
                  className="edit-form-input"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                />
              </label>
            </div>

            <div className="edit-form-row">
              <label>
                Alternate Mobile Number
                <input
                  type="tel"
                  name="alternate_mobile_number"
                  value={formData.alternate_mobile_number}
                  onChange={handleChange}
                  className="edit-form-input"
                  placeholder="Optional alternate number"
                  maxLength={10}
                />
              </label>
              <label>
                Address <span className="required">*</span>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="edit-form-input"
                  placeholder="Street address"
                />
              </label>
            </div>

            <div className="edit-form-row">
              <label>
                Locality
                <input
                  type="text"
                  name="locality"
                  value={formData.locality}
                  onChange={handleChange}
                  className="edit-form-input"
                  placeholder="Locality / Area"
                />
              </label>
              <label>
                City <span className="required">*</span>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="edit-form-input"
                  placeholder="City"
                />
              </label>
            </div>

            <div className="edit-form-row">
              <label>
                State <span className="required">*</span>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="edit-form-input"
                  placeholder="State"
                />
              </label>
              <label>
                Pincode <span className="required">*</span>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                  className="edit-form-input"
                  placeholder="Postal / ZIP code"
                  maxLength={10}
                />
              </label>
            </div>

            <div className="edit-form-row">
              <label>
                Landmark
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="edit-form-input"
                  placeholder="Nearby landmark (optional)"
                />
              </label>
              <label>
                Country <span className="required">*</span>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="edit-form-input"
                  placeholder="Country"
                />
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-fullwidth">
              Update Address
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditAddress;
