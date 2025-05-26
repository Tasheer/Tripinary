import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-column">
                    <img src="/logo.jpg" alt="" className='footerLogo'/>
                </div>
                <div className="footer-column">
                    <h3>Navigation</h3>
                    <ul>
                        <li><NavLink to="/about">About Us</NavLink></li>
                        <li><NavLink to="/contact">Contact Us</NavLink></li>
                        <li><NavLink to="">FAQs</NavLink></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Social Media</h3>
                    <ul>
                        <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                        <li><a href="https://x.com" target="_blank" rel="noopener noreferrer">Twitter / X</a></li>
                        <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Legal</h3>
                    <ul>
                        <li><a href="/terms">Terms & Conditions</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/cookies">Cookie Policy</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2025 Tripinary. All rights reserved.</p>
                <p>Designed by Tasheer</p>
            </div>
        </footer>
    );
};

export default Footer;
