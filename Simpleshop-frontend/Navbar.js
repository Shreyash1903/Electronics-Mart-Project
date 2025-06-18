import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { CartContext } from "../context/CartContext";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation(); // Get current path
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const isAuthenticated = !!localStorage.getItem("access_token");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to logout ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_name");
        navigate("/login");
        Swal.fire("Logged out !", "You have been logged out.", "success");
        setMenuOpen(false);
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setMenuOpen(false);
    }
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  // Only show search bar if on the products page
  const isProductsPage = location.pathname === "/products";

  return (
    <nav className="navbar">
      <Link to="/home" className="logo" onClick={closeMenus}>
        Electronics Mart
      </Link>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        {isAuthenticated && isProductsPage && (
          <li>
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">Search</button>
            </form>
          </li>
        )}

        {!isAuthenticated ? (
          <>
            <li><Link to="/login" onClick={closeMenus}>Login</Link></li>
            <li><Link to="/signup" onClick={closeMenus}>Sign Up</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/about" onClick={closeMenus}>About</Link></li>
            <li><Link to="/products" onClick={closeMenus}>Products</Link></li>
            <li><Link to="/wishlist" onClick={closeMenus}>❤️ Wishlist</Link></li>
            <li>
              <Link to="/cart" className="cart-link" onClick={closeMenus}>
                🛒 Cart ({cartItemCount})
              </Link>
            </li>
            <li ref={dropdownRef} className="profile-dropdown">
              <div
                className="navbar-avatar"
                title="Profile"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                <FaUser className="profile-icon" />
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={() => { navigate("/profile"); closeMenus(); }}>
                    👤 My Profile
                  </button>
                  <button onClick={() => { navigate("/my-address"); closeMenus(); }}>
                    🏠 My Address
                  </button>
                  <button onClick={() => { navigate("/my-orders"); closeMenus(); }}>
                    🧾 My Orders
                  </button>
                  <button onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
