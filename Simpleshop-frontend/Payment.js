import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Payment.css";

const Payment = () => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAmount = localStorage.getItem("finalAmount");
    setAmount(storedAmount ? parseFloat(storedAmount) : 0);
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    const res = await loadRazorpayScript();

    if (!res) {
      Swal.fire({
        title: "Connection Error",
        text: "Razorpay SDK failed to load. Check your internet connection.",
        icon: "error",
        background: "#1e1e2d",
        color: "#fff",
        confirmButtonColor: "#6c5ce7"
      });
      setLoading(false);
      return;
    }

    try {
      const amountInPaise = Math.round(amount * 100);

      const orderResponse = await fetch("http://localhost:8000/api/razorpay/create-order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ amount: amountInPaise }),
      });

      if (!orderResponse.ok) {
        Swal.fire({
          title: "Order Error",
          text: "Failed to create Razorpay order. Please try again.",
          icon: "error",
          background: "#1e1e2d",
          color: "#fff",
          confirmButtonColor: "#6c5ce7"
        });
        setLoading(false);
        return;
      }

      const orderData = await orderResponse.json();

      if (!orderData.order_id) {
        Swal.fire({
          title: "Order Error",
          text: "Order ID missing. Please try again.",
          icon: "error",
          background: "#1e1e2d",
          color: "#fff",
          confirmButtonColor: "#6c5ce7"
        });
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Electronics Mart",
        description: "Order Payment",
        order_id: orderData.order_id,
        handler: async function (response) {
          const addressId = localStorage.getItem("selectedAddressId");
          const items = JSON.parse(localStorage.getItem("itemsToDisplay")) || [];
          const totalAmount = localStorage.getItem("finalAmount");
          const token = localStorage.getItem("access_token");

          const orderPayload = {
            address: addressId,
            total_price: totalAmount,
            is_paid: true,
            razorpay_order_id: orderData.order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            items: items.map((item) => ({
              product: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          };

          try {
            const res = await fetch("http://localhost:8000/api/orders/create/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(orderPayload),
            });

            if (!res.ok) throw new Error("Failed to save order");

            Swal.fire({
              title: "🎉 Payment Successful !",
              text: `Your payment ID : ${response.razorpay_payment_id}`,
              icon: "success",
              background: "#1e1e2d",
              color: "#fff",
              confirmButtonColor: "#6c5ce7",
              confirmButtonText: "View My Orders"
            }).then(() => {
              navigate("/my-orders");
            });
          } catch (error) {
            console.error("Order save failed:", error);
            Swal.fire({
              title: "Partial Success",
              text: "Payment succeeded, but failed to save order. Contact support with your payment ID.",
              icon: "warning",
              background: "#1e1e2d",
              color: "#fff",
              confirmButtonColor: "#6c5ce7"
            });
          }
        },
        prefill: {
          name: "John Doe",
          email: "johndoe@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#6c5ce7",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setLoading(false);
    } catch (error) {
      console.error("Payment error :", error);
      Swal.fire({
        title: "Payment Error",
        text: "Something went wrong. Please try again.",
        icon: "error",
        background: "#1e1e2d",
        color: "#fff",
        confirmButtonColor: "#6c5ce7"
      });
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <h2>Complete Your Purchase</h2>
          <p>Secure payment processed by Razorpay</p>
        </div>
        
        <div className="payment-summary">
          <div className="summary-item">
            <span>Subtotal</span>
            <span>₹ {amount.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Shipping</span>
            <span>FREE</span>
          </div>
          <div className="summary-item total">
            <span>Total Amount</span>
            <span>₹ {amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="payment-methods">
          <div className="payment-method selected">
            <div className="method-icon">
              <img src="https://www.yourtechstory.com/wp-content/uploads/2020/01/razorpay.png" alt="Razorpay" />
            </div>
            <div className="method-info">
              <h4>Razorpay Secure</h4>
              <p>Credit/Debit Cards, UPI, Netbanking</p>
            </div>
          </div>
        </div>

        <button 
          className="pay-button" 
          onClick={handleRazorpayPayment}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            <>Pay ₹ {amount.toFixed(2)} Securely</>
          )}
        </button>

        <div className="payment-security">
          <div className="security-badge">
            <i className="lock-icon">🔒</i>
            <span>256-bit SSL Secure Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
