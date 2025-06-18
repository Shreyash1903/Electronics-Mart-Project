import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import "./Checkout.css";

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderSummaryVisible, setOrderSummaryVisible] = useState(false);
  const [paymentVisible, setPaymentVisible] = useState(false);

  const directBuyProduct = location.state?.directBuyProduct;

  const [itemsToDisplay, setItemsToDisplay] = useState(() => {
    if (directBuyProduct) {
      return [{ ...directBuyProduct, quantity: 1 }];
    } else {
      return cartItems.map((item) => ({ ...item }));
    }
  });

  const total = itemsToDisplay.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const savedAddressId = localStorage.getItem("selectedAddressId");
    if (savedAddressId) setSelectedAddressId(savedAddressId);

    const token = localStorage.getItem("access_token");
    if (token) {
      axios
        .get("http://localhost:8000/api/addresses/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setAddresses(res.data))
        .catch((err) => console.error("Failed to load addresses", err));
    }
  }, []);

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    localStorage.setItem("selectedAddressId", id);
  };

  const handleDeliverHere = () => {
    if (!selectedAddressId) {
      Swal.fire({
        icon: "warning",
        title: "No Address Selected",
        text: "Please select an address to continue.",
      });
      return;
    }
    setOrderSummaryVisible(true);
    setPaymentVisible(false);
  };

  const handleContinueToPayment = () => {
    if (!selectedAddressId) {
      Swal.fire({
        icon: "warning",
        title: "No Address Selected",
        text: "Please select an address to continue.",
      });
      return;
    }

    // ✅ Add this line
    localStorage.setItem("itemsToDisplay", JSON.stringify(itemsToDisplay));

    // ✅ Already saving the total amount
    localStorage.setItem("finalAmount", total); // Save before navigating
    
    navigate("/payment", {
      state: {
        selectedAddressId,
        itemsToDisplay,
        total,
      },
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      Swal.fire({
        icon: "warning",
        title: "No Delivery Address",
        text: "Please select or add a delivery address.",
      });
      return;
    }

    if (itemsToDisplay.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Items in Cart",
        text: "Please add items to your cart before proceeding.",
      });
      return;
    }

    const token = localStorage.getItem("access_token");
    const orderData = {
      address: selectedAddressId,
      total_price: total,
      payment_method: paymentMethod,
      items: itemsToDisplay.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      await axios.post("http://localhost:8000/api/orders/create/", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!directBuyProduct) clearCart();

      Swal.fire({
        icon: "success",
        title: "Order Placed!",
        text: "Your order has been successfully placed.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/order-success");
    } catch (error) {
      console.error("Order placement error:", error);
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="checkout-container">
      {/* Section 1: Delivery Address */}
      <div className="section">
        <div className="section-header">
          <span>1</span> DELIVERY ADDRESS
          <button
            onClick={() => navigate("/add-address")}
            className="text-sm text-white underline"
          >
            + Add New
          </button>
        </div>
        <div className="section-content">
          {addresses.length === 0 ? (
            <p>No addresses found. Please add one.</p>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr.id}
                className={`address-card ${
                  selectedAddressId === addr.id ? "selected" : ""
                }`}
                onClick={() => handleSelectAddress(addr.id)}
              >
                <div className="address-header">
                  <h4>{addr.name.toUpperCase()}</h4>
                  <span className="address-phone">{addr.mobile_number}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/edit-address", { state: { address: addr } });
                    }}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                </div>
                <p className="address-detail">
                  {addr.address}, {addr.city}, {addr.state} -{" "}
                  <strong>{addr.pincode}</strong>
                </p>
                {selectedAddressId === addr.id && (
                  <button className="deliver-btn" onClick={handleDeliverHere}>
                    DELIVER HERE
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section 2: Order Summary */}
      <div className={`section ${orderSummaryVisible ? "" : "disabled"}`}>
        <div className="section-header">
          <span>2</span> ORDER SUMMARY
        </div>
        {orderSummaryVisible && (
          <div className="section-content">
            {itemsToDisplay.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                {itemsToDisplay.map((item, index) => (
                  <div
                    className="order-item"
                    key={item.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #ddd",
                      paddingBottom: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    {/* Top: name and price */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: "500",
                      }}
                    >
                      <span>{item.name}</span>
                      <span>₹ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>

                    {/* Bottom: quantity controls aligned left */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginTop: "10px",
                        justifyContent: "flex-start", // align controls to left
                      }}
                    >
                      <button
                        className="qty-btn"
                        onClick={() => {
                          const updatedItems = [...itemsToDisplay];
                          if (updatedItems[index].quantity > 1) {
                            updatedItems[index].quantity -= 1;
                            setItemsToDisplay(updatedItems);
                          }
                        }}
                      >
                        -
                      </button>

                      <span style={{ minWidth: "20px", textAlign: "center" }}>
                        {item.quantity}
                      </span>

                      <button
                        className="qty-btn"
                        onClick={() => {
                          const updatedItems = [...itemsToDisplay];
                          updatedItems[index].quantity += 1;
                          setItemsToDisplay(updatedItems);
                        }}
                      >
                        +
                      </button>

                      <button
                        style={{
                          backgroundColor: "#e74c3c",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          cursor: "pointer",
                          marginLeft: "12px",
                        }}
                        onClick={() => {
                          const updatedItems = itemsToDisplay.filter(
                            (_, i) => i !== index
                          );
                          setItemsToDisplay(updatedItems);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div className="order-total">
                  <span>Total :</span>
                  <span>₹ {total.toFixed(2)}</span>
                </div>

                <button className="continue-btn" onClick={handleContinueToPayment}>
                  CONTINUE
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Section 3: Payment Options */}
      <div className={`section payment-section ${paymentVisible ? "" : "disabled"}`}>
        <div className="section-header">
          <span>3</span> PAYMENT OPTIONS
        </div>
        {paymentVisible && (
          <div className="section-content">
            <div className="payment-option">
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />{" "}
                Cash on Delivery (COD)
              </label>
            </div>
            <div className="payment-option text-gray-400">
              <label>
                <input type="radio" name="payment" value="online" disabled /> Online
                Payment (Coming Soon)
              </label>
            </div>

            <button className="place-order-btn" onClick={handlePlaceOrder}>
              PLACE ORDER
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
