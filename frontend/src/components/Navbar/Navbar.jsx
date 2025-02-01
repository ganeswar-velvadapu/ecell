// Navbar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = ({ onMenuClick, cartCount = 0 }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Sidebar Menu Button */}
        <button 
          className={styles.menuButton}
          onClick={onMenuClick}
          aria-label="Toggle Sidebar Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Logo Section */}
        <div className={styles.logoContainer} onClick={() => navigate('/')}> 
          <img src="/assets/images/logo.png" alt="Company Logo" className={styles.logo} />
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`${styles.mobileMenuBtn} ${isMobileMenuOpen ? styles.active : ''}`}
          onClick={handleMobileMenuToggle}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Nav Links */}
        <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.active : ''}`}>
          <button className={styles.navButton} onClick={() => navigate('/combos')}>
            Explore Combos
          </button>

          <button className={styles.navButton} onClick={() => navigate('/partner')}>
            Become a Partner
          </button>

          {/* Cart Button */}
          <button className={styles.cartButton} onClick={() => navigate('/cart')}>
            <svg viewBox="0 0 24 24" className={styles.cartIcon}>
              <path d="M9 22c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm7 0c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-7-3l-4-4H2V5h3l8 9h5l3-7h3l-4 9H9zm3-8V7H4" 
                stroke="currentColor" 
                fill="none" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </button>

          {/* Auth Section */}
          {isLoggedIn ? (
            <div className={styles.profileContainer}>
              <img 
                src="/assets/images/default-profile.png"
                alt="Profile"
                className={styles.profilePic}
                onClick={() => navigate('/profile')}
              />
            </div>
          ) : (
            <button className={styles.authButton} onClick={() => navigate('/login')}>
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;