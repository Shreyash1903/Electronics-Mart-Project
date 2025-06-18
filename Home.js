import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  const handleViewProducts = () => {
    navigate('/products');
  };

  const topBrands = [
    'Apple',
    'HP',
    'Samsung',
    'Amazfit',
    'Sony',
    'Canon',
    'LG',
    'Logitech',
    'Xiaomi'
  ];

  const brandImages = {
    'Apple': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    'HP': 'http://cdn.wallpapersafari.com/80/15/X8QGrT.jpg',
    'Samsung': 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
    'Amazfit': 'https://logos-world.net/wp-content/uploads/2021/12/Amazfit-New-Logo-700x394.png',
    'Sony': 'https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png',
    'Canon': 'https://static.vecteezy.com/system/resources/previews/020/190/413/original/canon-logo-canon-icon-free-free-vector.jpg',
    'LG': 'https://th.bing.com/th/id/OIP._si4va_1MybkM60kxMFoJwHaD6?r=0&rs=1&pid=ImgDetMain',
    'Logitech': 'https://th.bing.com/th/id/OIP.l2F9_i_vWMiqV5SrXlHRNQHaEK?r=0&rs=1&pid=ImgDetMain',
    'Xiaomi': 'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg',
  };

  const brandDescriptions = {
    'Apple': 'Premium smartphones with cutting-edge performance.',
    'HP': 'Reliable laptops for work, study, and play.',
    'Samsung': 'Top-tier smart TVs for immersive viewing.',
    'Amazfit': 'Smart wearables to track your health and fitness.',
    'Sony': 'High-fidelity audio devices for music lovers.',
    'Canon': 'Capture life with Canon’s professional cameras.',
    'LG': 'Smart home appliances for modern living.',
    'Logitech': 'Top-notch printers and computer accessories.',
    'Xiaomi': 'High-capacity chargers and power banks at great value.',
  };

  return (
    <>
      <div className="home-container">
        {/* Hero Banner */}
        <section className="hero-banner">
          {[
            {
              title: "🔥 Up to 50% Off on Smart TVs !",
              desc: "Grab the best deals on your favorite smart entertainment.",
            },
            {
              title: "📱 Top Smartphones of 2025",
              desc: "Latest models with unbeatable prices.",
            },
            {
              title: "💻 Exclusive Deals on Laptops",
              desc: "High-performance devices for work and play.",
            }
          ].map((item, index) => (
            <div className="hero-slide" key={index}>
              <h2>{item.title}</h2>
              <p>{item.desc}</p>
            </div>
          ))}
        </section>

        <header className="home-hero-card">
          <h1>Welcome to Electronics Mart</h1>
          <p>Your one-stop destination for the latest and greatest in consumer electronics.</p>
        </header>

        {/* Top Brands Section */}
        <h2 className="features-title">Top Trending Brands</h2>
        <div className="category-grid">
          {topBrands.map((brand, index) => (
            <div
              key={index}
              className="category-card"
              style={{ cursor: 'pointer' }}
            >
              <img
                src={brandImages[brand]}
                alt={`${brand} logo`}
                style={{
                  height: '60px',
                  marginBottom: '10px',
                  objectFit: 'contain'
                }}
              />
              <h3>{brand}</h3>
              <p>{brandDescriptions[brand]}</p>
            </div>
          ))}
        </div>

        <h2 className="features-title">Explore Our Categories</h2>
        <p style={{ textAlign: 'center', marginTop: '-10px', marginBottom: '20px' }}>
          Shop by your favorite electronics.
        </p>
        <div className="category-grid">
          {[
            { icon: "📱", title: "Smartphones", desc: "Latest Android & iOS phones." },
            { icon: "💻", title: "Laptops", desc: "Work and gaming laptops." },
            { icon: "📺", title: "Smart TVs", desc: "Modern Smart TV experience." },
            { icon: "⌚", title: "Smart Watches & Wearables", desc: "Smartwatches, rings, fitness bands." },
            { icon: "🎧", title: "Audio Devices", desc: "Headphones, speakers, earbuds." },
            { icon: "📷", title: "Cameras & Photography", desc: "DSLRs, webcams, action cameras." },
            { icon: "🏠", title: "Smart Home Appliances", desc: "Smart ACs, lights, and more." },
            { icon: "🖨️", title: "Printers & Mouse", desc: "Office printers and wireless mice." },
            { icon: "🔌", title: "Chargers & Power Banks", desc: "Fast chargers and portable power banks." }
          ].map((cat, i) => (
            <div
              className="category-card"
              key={i}
              onClick={() => handleCategoryClick(cat.title)}
              style={{ cursor: 'pointer' }}
            >
              <div className="category-icon">{cat.icon}</div>
              <h3>{cat.title}</h3>
              <p>{cat.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="features-title">Why Shop With Us?</h2>
        <div className="category-grid">
          {[
            { icon: "🚚", title: "Fast Delivery", desc: "Quick delivery to your doorstep." },
            { icon: "💳", title: "Secure Payments", desc: "Multiple secure payment options." },
            { icon: "🔄", title: "Easy Returns", desc: "Return within 7 days." },
            { icon: "📞", title: "24/7 Support", desc: "We’re here to help anytime." }
          ].map((feat, i) => (
            <div className="category-card" key={i}>
              <div className="category-icon">{feat.icon}</div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>

        <section className="testimonial-section">
          <h2 className="features-title">What Our Customers Say</h2>
          <div className="testimonial-card">
            <p className="testimonial-quote">“Electronics Mart has amazing deals and fast delivery. Highly recommend!”</p>
            <p className="testimonial-author">– Ankit S., Pune</p>
            <p className="testimonial-quote">“I loved the smooth experience and great customer service.”</p>
            <p className="testimonial-author">– Meera T., Delhi</p>
          </div>
        </section>

        <section className="trust-section">
          <h2 className="features-title">Join Thousands of Happy Customers</h2>
          <p style={{ textAlign: 'center', color: '#666', marginTop: '-10px' }}>
            Rated 4.9/5 by over 10,000 customers nationwide.
          </p>
        </section>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>Connect with me :</p>
          <div className="footer-links">
            <a href="https://github.com/Shreyash1903" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="fab fa-github"></i></a>
            <a href="https://www.linkedin.com/in/shreyash-hassekar-7a5045260/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
            <a href="https://x.com/ShreyashHassek3" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="https://www.kaggle.com/shreyashhassekar" target="_blank" rel="noopener noreferrer" aria-label="Kaggle"><i className="fab fa-kaggle"></i></a>
            <a href="mailto:shreyashhassekar@gmail.com" aria-label="Email"><i className="fas fa-envelope"></i></a>
          </div>
          <p className="footer-copy">&copy; {new Date().getFullYear()} Electronics Mart. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Home;
