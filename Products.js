import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import './Products.css';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewImage, setViewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [price, setPrice] = useState(100000);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');
  const [showBrandFilter, setShowBrandFilter] = useState(false);

  const { addToCart, updateQuantity, cartItems } = useContext(CartContext);
  const { wishlist, toggleWishlist, isWishlisted } = useContext(WishlistContext);

  const navigate = useNavigate();
  const location = useLocation();

  const getCategoryQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "";
  };

  const getFormattedCategory = () => {
    const category = decodeURIComponent(getCategoryQuery());
    return category
      ? category.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
      : 'All Products';
  };

  const getCategorySubtitle = () => {
    const category = decodeURIComponent(getCategoryQuery()).toLowerCase();
    switch (category) {
      case 'smartphones':
        return 'Explore the latest Android & iOS smartphones.';
      case 'laptops':
        return 'High-performance laptops for work and play.';
      case 'accessories':
        return 'Browse chargers, cables, and other essential gadgets.';
      case 'smart tvs':
        return 'Experience stunning visuals with our Smart TVs.';
      default:
        return 'Browse our collection of top-quality electronics.';
    }
  };

  useEffect(() => {
    axios.get('http://localhost:8000/api/products/')
      .then((res) => {
        setProducts(res.data);
        const cats = [...new Set(res.data.map((p) => p.category))];
        const brnds = [...new Set(res.data.map((p) => p.brand))];
        setCategories(cats);
        setBrands(brnds);
      })
      .catch((err) => console.error('Error fetching products :', err));
  }, []);

  useEffect(() => {
    let result = products;
    const categoryFromURL = getCategoryQuery();

    if (categoryFromURL) {
      result = result.filter(p => p.category?.toLowerCase() === categoryFromURL.toLowerCase());
    }

    if (selectedCategories.length) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedBrands.length) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    if (selectedRatings.length) {
      result = result.filter(p => selectedRatings.some(r => Math.floor(p.rating) >= r));
    }

    if (selectedAvailability.length) {
      result = result.filter(p => {
        if (selectedAvailability.includes("in") && p.stock > 0) return true;
        if (selectedAvailability.includes("out") && p.stock === 0) return true;
        return false;
      });
    }

    if (price < 100000) {
      result = result.filter(p => p.price <= price);
    }

    setFilteredProducts(result);
  }, [products, selectedCategories, selectedBrands, selectedRatings, selectedAvailability, price, location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        window.brandDropdownRef &&
        !window.brandDropdownRef.contains(event.target)
      ) {
        setBrandDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getQuantity = (id) => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  const closeModal = () => setViewImage(null);

  const handleBuyNow = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (!existingItem) {
      addToCart(product);
    }
    navigate('/checkout');
  };

  const toggleSelection = (array, setter, value) => {
    setter(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star full">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    while (stars.length < 5) {
      stars.push(<span key={`empty-${stars.length}`} className="star empty">★</span>);
    }

    return stars;
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedRatings([]);
    setSelectedAvailability([]);
    setSelectedBrands([]);
    setPrice(100000);
    setBrandSearch('');
  };

  return (
    <div className="products-page">
      {!getCategoryQuery() && (
        <div className="filter-sidebar">
          <h3>Filters</h3>

          <div className="filter-section">
            <label>Category</label>
            {categories.map((cat, idx) => (
              <div key={idx}>
                <input
                  type="checkbox"
                  value={cat}
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleSelection(selectedCategories, setSelectedCategories, cat)}
                />
                <span>{cat}</span>
              </div>
            ))}
          </div>

       {/* // Inside Products.js (only brand filter section updated for brevity) */}

      <div className="filter-section brand-filter" ref={(ref) => (window.brandDropdownRef = ref)}>
        <div
          className="brand-header"
          onClick={() => setShowBrandFilter((prev) => !prev)}
        >
          <label>BRAND</label>
          <span className={`brand-toggle-icon ${showBrandFilter ? 'rotate' : ''}`}>▾</span>
        </div>

        {showBrandFilter && (
          <div className="brand-dropdown">
            <input
              type="text"
              placeholder="Search Brand"
              value={brandSearch}
              onChange={(e) => {
                setBrandSearch(e.target.value);
                setBrandDropdownOpen(true); // Show all matching results as user types
              }}
              className="brand-search-input"
            />
            <div className="brand-checkboxes">
              {(brandSearch ? brands.filter((b) =>
                b.toLowerCase().includes(brandSearch.toLowerCase())
              ) : brands)
                .slice(0, brandDropdownOpen ? brands.length : 6)
                .map((brand, idx) => (
                  <label key={idx} className="brand-checkbox-item">
                    <input
                      type="checkbox"
                      value={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={() =>
                        toggleSelection(selectedBrands, setSelectedBrands, brand)
                      }
                    />
                    {brand}
                  </label>
                ))}
            </div>

            {brands.filter(b =>
              b.toLowerCase().includes(brandSearch.toLowerCase())
            ).length > 6 && !brandDropdownOpen && (
              <span
                className="brand-show-more"
                onClick={() => setBrandDropdownOpen(true)}
              >
                {brands.length - 6} MORE
              </span>
            )}
          </div>
        )}
      </div>



          <div className="filter-section">
            <label>Rating</label>
            {[4, 3, 2, 1].map((r) => (
              <div key={r}>
                <input
                  type="checkbox"
                  value={r}
                  checked={selectedRatings.includes(r)}
                  onChange={() => toggleSelection(selectedRatings, setSelectedRatings, r)}
                />
                <span>{r} stars & above</span>
              </div>
            ))}
          </div>

          <div className="filter-section">
            <label>Availability</label>
            <div>
              <input
                type="checkbox"
                value="in"
                checked={selectedAvailability.includes("in")}
                onChange={() => toggleSelection(selectedAvailability, setSelectedAvailability, "in")}
              />
              <span>In Stock</span>
            </div>
            <div>
              <input
                type="checkbox"
                value="out"
                checked={selectedAvailability.includes("out")}
                onChange={() => toggleSelection(selectedAvailability, setSelectedAvailability, "out")}
              />
              <span>Out of Stock</span>
            </div>
          </div>

          <div className="filter-section">
            <label>Price (Up to ₹{price})</label>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value))}
            />
          </div>

          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      <div className="products-main">
        <div className="products-header">
          <h2 className="products-title">{getFormattedCategory()}</h2>
          <p className="products-subtitle">{getCategorySubtitle()}</p>
        </div>

        {viewImage && (
          <div className="modal" onClick={closeModal}>
            <img src={viewImage} alt="View Product" className="modal-image" />
          </div>
        )}

        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <p className="no-products">No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="wishlist-btn" onClick={() => toggleWishlist(product)}>
                  {isWishlisted(product.id) ? '❤️' : '🤍'}
                </div>
                <img
                  src={`http://localhost:8000${product.image}`}
                  alt={product.name}
                  className="product-image"
                  onClick={() => setViewImage(`http://localhost:8000${product.image}`)}
                />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  <p className="product-rating">
                    {product.rating.toFixed(1)} {renderStars(product.rating)}
                  </p>
                  <p className="price">
                    <span className="price-label">Price:</span> ₹ {product.price}
                  </p>
                  <div className="button-group">
                    {getQuantity(product.id) === 0 ? (
                      <div className="add-buy-row">
                        <button className="add-to-cart-btn" onClick={() => addToCart(product)}>Add to Cart</button>
                        <button className="buy-now-btn" onClick={() => handleBuyNow(product)}>Buy Now</button>
                      </div>
                    ) : (
                      <>
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(product.id, -1)}>-</button>
                          <span>{getQuantity(product.id)}</span>
                          <button onClick={() => updateQuantity(product.id, 1)}>+</button>
                        </div>
                        <div className="add-buy-row">
                          <button className="buy-now-btn" onClick={() => handleBuyNow(product)}>Buy Now</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
