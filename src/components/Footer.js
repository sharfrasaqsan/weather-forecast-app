import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} Your Weather App</p>
        <p>Designed with ❤️ by Your Name</p>
      </div>
    </footer>
  );
};

export default Footer;
