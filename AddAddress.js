import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import './AddAddress.css';

const AddAddress = () => {
  const [form, setForm] = useState({
    name: "",
    mobile_number: "",
    alternate_mobile_number: "",
    address: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    country: "India",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Not Logged In",
        text: "Please log in before adding an address.",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/addresses/",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const addressId = response.data.id;
      localStorage.setItem("selectedAddressId", addressId);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Address added successfully !",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/checkout");
    } catch (error) {
      console.error("Error adding address:", error);

      Swal.fire({
        icon: "error",
        title: "Failed to Add Address",
        text:
          error.response?.data?.detail ||
          "Please make sure you're logged in and your data is valid.",
      });
    }
  };

  return (
    <>
      {/* Heading outside the card container */}
      <h2 className="page-heading">Add Shipping Address</h2>

      {/* Card container */}
      <div className="add-address-container">
        <form className="add-address-form" onSubmit={handleSubmit}>

          {/* Full Name */}
          <div>
            <label htmlFor="name">
              Full Name <span className="required">*</span>
            </label>
            <input
              id="name"
              className="add-address-input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mobile + Alternate Mobile */}
          <div className="add-address-form-row">
            <div>
              <label htmlFor="mobile_number">
                Mobile Number <span className="required">*</span>
              </label>
              <input
                id="mobile_number"
                className="add-address-input"
                type="text"
                name="mobile_number"
                value={form.mobile_number}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="alternate_mobile_number">
                Alternate Mobile Number <span className="required">*</span>
              </label>
              <input
                id="alternate_mobile_number"
                className="add-address-input"
                type="text"
                name="alternate_mobile_number"
                value={form.alternate_mobile_number}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address">
              Address <span className="required">*</span>
            </label>
            <input
              id="address"
              className="add-address-input"
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* Locality */}
          <div>
            <label htmlFor="locality">
              Locality <span className="required">*</span>
            </label>
            <input
              id="locality"
              className="add-address-input"
              type="text"
              name="locality"
              value={form.locality}
              onChange={handleChange}
              required
            />
          </div>

          {/* City + State */}
          <div className="add-address-form-row">
            <div>
              <label htmlFor="city">
                City <span className="required">*</span>
              </label>
              <input
                id="city"
                className="add-address-input"
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="state">
                State <span className="required">*</span>
              </label>
              <input
                id="state"
                className="add-address-input"
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Pincode + Landmark */}
          <div className="add-address-form-row">
            <div>
              <label htmlFor="pincode">
                Pincode <span className="required">*</span>
              </label>
              <input
                id="pincode"
                className="add-address-input"
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="landmark">
                Landmark <span className="required">*</span>
              </label>
              <input
                id="landmark"
                className="add-address-input"
                type="text"
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country">
              Country <span className="required">*</span>
            </label>
            <input
              id="country"
              className="add-address-input"
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-fullwidth">
            Save Address
          </button>
        </form>
      </div>
    </>
  );
};

export default AddAddress;
