import React from "react";
import "./About.css";
import "@fontsource/montserrat";

import {
  FaCogs,
  FaPython,
  FaReact,
  FaLock,
  FaGoogle,
  FaRupeeSign,
  FaFilePdf,
  FaPalette,
  FaDatabase,
  FaServer,
  FaBoxOpen,
  FaShoppingCart,
  FaUserShield,
  FaHeart,
  FaMapMarkedAlt,
  FaMobileAlt,
  FaStar,
  FaUserEdit,
  FaBoxes,
} from "react-icons/fa";

const About = () => {
  return (
    <div className="about-page">
      <header className="about-hero card">
        <h1>
          About <span>Electronics Mart</span>
        </h1>
        <p>
          Your trusted destination for a seamless and modern electronics shopping experience — built with cutting-edge technologies and a strong focus on user experience.
        </p>
      </header>

      {/* Technology Stack Section */}
      <section className="about-section card">
        <h2>
          <FaCogs style={{ marginRight: "8px" }} />
          Technology Stack
        </h2>
        <div className="tech-grid">
          <div className="tech-card">
            <FaPython className="tech-icon" />
            <h4>Django & DRF</h4>
            <p>Backend powered by Django 5.2.1 and Django REST Framework for robust APIs.</p>
          </div>
          <div className="tech-card">
            <FaReact className="tech-icon" />
            <h4>React.js</h4>
            <p>Frontend built using React.js with React Router and modular components.</p>
          </div>
          <div className="tech-card">
            <FaLock className="tech-icon" />
            <h4>JWT Auth</h4>
            <p>Secure user sessions using JSON Web Tokens stored in localStorage.</p>
          </div>
          <div className="tech-card">
            <FaGoogle className="tech-icon" />
            <h4>Google OAuth</h4>
            <p>Social login integrated via dj-rest-auth and allauth.</p>
          </div>
          <div className="tech-card">
            <FaRupeeSign className="tech-icon" />
            <h4>Razorpay</h4>
            <p>Secure online payments with Razorpay integration at checkout.</p>
          </div>
          <div className="tech-card">
            <FaFilePdf className="tech-icon" />
            <h4>xhtml2pdf</h4>
            <p>PDF invoice generation for downloadable order receipts.</p>
          </div>
          <div className="tech-card">
            <FaPalette className="tech-icon" />
            <h4>CSS + Icons</h4>
            <p>Clean, responsive UI with CSS Modules and React Icons.</p>
          </div>
          <div className="tech-card">
            <FaDatabase className="tech-icon" />
            <h4>SQLite/PostgreSQL</h4>
            <p>Flexible database support for development and production.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="about-section card">
        <h2>🚀 Core Features Overview</h2>

        <div className="features-grid">
          <div className="feature-card">
            <FaUserShield />
            <h3>Secure Login</h3>
            <p>JWT-based login and Google OAuth for fast, safe access.</p>
          </div>

          <div className="feature-card">
            <FaShoppingCart />
            <h3>Smart Cart</h3>
            <p>Add, remove and manage cart items with quantity control.</p>
          </div>

          <div className="feature-card">
            <FaHeart />
            <h3>Wishlist</h3>
            <p>Save favorite products with persistent local storage.</p>
          </div>

          <div className="feature-card">
            <FaBoxes />
            <h3>Product Filtering</h3>
            <p>Filter by brand, rating, and availability to find what you need.</p>
          </div>

          <div className="feature-card">
            <FaMapMarkedAlt />
            <h3>Address Book</h3>
            <p>Manage multiple shipping addresses during checkout.</p>
          </div>

          <div className="feature-card">
            <FaUserEdit />
            <h3>Profile Management</h3>
            <p>Edit user profile and password securely.</p>
          </div>

          <div className="feature-card">
            <FaStar />
            <h3>Responsive Design</h3>
            <p>Mobile-first UI that adapts to any screen size.</p>
          </div>

          <div className="feature-card">
            <FaMobileAlt />
            <h3>Smart Alerts</h3>
            <p>Interactive feedback via SweetAlert2 modals and validations.</p>
          </div>
        </div>
      </section>

      {/* Structure */}
      <section className="about-section card">
        <h2>🗂️ Project Structure</h2>
        <ul>
          <li><strong>Frontend :</strong> React components, protected routes, Cart/Wishlist via Context API</li>
          <li><strong>Backend :</strong> Custom User model, Products, Orders, Address, and Invoice APIs</li>
        </ul>
      </section>

      {/* Thank You Footer */}
      <div className="card thank-you">
        <p>
          Thank you for exploring <strong>Electronics Mart</strong>. We hope you enjoy the seamless shopping experience and thoughtful features built just for you!
        </p>
      </div>
    </div>
  );
};

export default About;
