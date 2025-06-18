import React, { useContext } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  return (
    <div className="wishlist-page">
      <h2>My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="empty-msg">Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product.id} className="wishlist-card">
              <div className="wishlist-image">
                <img
                  src={`http://localhost:8000${product.image}`}
                  alt={product.name}
                  loading="lazy"
                />
              </div>
              <div className="wishlist-details">
                <h3>{product.name}</h3>
                <p className="wishlist-description">
                  {product.description?.slice(0, 100)}...
                </p>
                <div className="wishlist-rating">
                  <span className="rating-value">
                    {Number(product.rating || 0).toFixed(1)}
                  </span>
                  <span className="stars">★★★★★</span>
                </div>
                <div className="wishlist-price-row">
                  <span className="price-label">Price :</span>
                  <span className="price-value">
                    ₹{' '}
                    {Number(product.price).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="wishlist-buttons">
                  <button
                    onClick={() => addToCart(product)}
                    className="add-cart-btn"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
