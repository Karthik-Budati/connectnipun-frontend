// src/components/Layout.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Layout.css'; // Create this file next to style navbar/footer
import logo from '../assets/logo.png';

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="layout-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo-area">
          <img src={logo} alt="Connect Nipun Logo" className="logo-img" />
          <span className="brand-name">Connect Nipun</span>
        </div>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/">Home</Link>
          <Link to="/register">Register</Link>
          <Link to="/workers">Find Worker</Link>
        </nav>

        {/* Hamburger for mobile */}
        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
      </header>

      {/* Page Content */}
      <main className="main-content">{children}</main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Connect Nipun. All rights reserved.</p>
        <p>Contact: connect.helpdesk@gmail.com</p>
        <p>Made with 💙 for India’s workforce</p>
      </footer>
    </div>
  );
}

export default Layout;
