import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Swal from 'sweetalert2';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const getTotal = () => {
    return cartItems
      .reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
      .toFixed(2);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Empty Cart',
        text: 'Please add items to your cart before proceeding.',
      });
      return;
    }
    navigate('/checkout');
  };

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Shopping Cart</h1>
        <p className="cart-subtitle">
          Thanks for shopping with <strong>SimpleShop</strong> ! Review your items below.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart-container">
          <div className="empty-cart-icon">🛒</div>
          <p className="empty-cart-message">Your cart is empty</p>
          <p className="empty-cart-subtext">Start adding some amazing products !</p>
          <button 
            className="continue-shopping-btn"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-container">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="item-image-container">
                  <img
                    src={`http://localhost:8000${item.image}`}
                    alt={item.name}
                    className="item-image"
                    onClick={() => handleProductClick(item.id)}
                  />
                  {item.quantity > 1 && (
                    <span className="item-badge">{item.quantity}</span>
                  )}
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <div className="price-row">
                    <span className="item-price">Rs. {Number(item.price).toFixed(2)}</span>
                    <span className="item-total">Rs. {(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn minus"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        −
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button 
                        className="quantity-btn plus"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3 className="summary-title">Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rs. {getTotal()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span className="grand-total">Rs. {getTotal()}</span>
              </div>
              <button 
                className="checkout-btn"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </button>
              <button 
                className="continue-shopping-btn"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;