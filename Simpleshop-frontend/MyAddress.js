import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import './MyAddress.css';

const MyAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          Swal.fire({
            icon: "warning",
            title: "Not Logged In",
            text: "Please log in to view your saved addresses.",
          });
          return;
        }
        const response = await axios.get("http://localhost:8000/api/addresses/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAddresses(response.data);
      } catch (error) {
        console.error("Failed to fetch addresses :", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Could not load addresses. Please try again later.",
        });
      }
    };

    fetchAddresses();
  }, []);

  const handleProceed = (addressId) => {
    localStorage.setItem("selectedAddressId", addressId);
    navigate("/checkout");
  };

  const handleAddNew = () => {
    navigate("/add-address");
  };

  return (
    <div className="my-address-container">
      <h2 className="my-address-heading">My Saved Addresses</h2>
      {addresses.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">No address found.</p>
          <button onClick={handleAddNew} className="btn btn-primary btn-add">
            Add Address
          </button>
        </div>
      ) : (
        <div className="addresses-list">
          {addresses.map((addr) => (
            <div key={addr.id} className="address-card">
              <p className="address-name">{addr.name}</p>
              <p className="address-line">
                {addr.address}, {addr.locality}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="address-phone">{addr.mobile_number}</p>
              <div className="btn-group">
                <button
                  onClick={() => handleProceed(addr.id)}
                  className="btn btn-success"
                >
                  Proceed with this Address
                </button>
                <button
                  onClick={handleAddNew}
                  className="btn btn-primary"
                >
                  Add New Address
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAddress;
