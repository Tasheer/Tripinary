import React from 'react';
import Navbar from '../components/Navbar';
import banner from './banner.png';
import { FaNode, FaReact, FaMapMarkedAlt, FaCalendarAlt, FaLightbulb, FaCheckCircle } from 'react-icons/fa';
import { SiExpress, SiMongodb } from 'react-icons/si';
import Footer from '../Footer';

const About = () => {
    return (
        <div>
            <Navbar />
            <img src={banner} alt="" className='banner'/>
            <div className="about-container">
                <h1>About Tripinary</h1>
                <p className="tagline">Your Smart Travel Companion</p>
                <p className="description">
                    Tripinary is a modern itinerary builder that helps you plan, organize, and personalize your travel experiences.
                    Built with the MERN stack (MongoDB, Express, React, Node.js), Tripinary lets you:
                </p>

                <div className="features-icons">
                    <div className="feature">
                        <FaMapMarkedAlt className="icon" />
                        <p>Share Travel Stories</p>
                    </div>
                    <div className="feature">
                        <FaCalendarAlt className="icon" />
                        <p>Auto-Generate Itineraries</p>
                    </div>
                    <div className="feature">
                        <FaLightbulb className="icon" />
                        <p>Smart Recommendations</p>
                    </div>
                </div>

                <h2>Key Features</h2>
                <ul className="key-features">
                    <li><FaCheckCircle className="check-icon" /> Dynamic Itinerary Generation</li>
                    <li><FaCheckCircle className="check-icon" /> Real User Experiences as Input</li>
                    <li><FaCheckCircle className="check-icon" /> Budget-based Travel Plans</li>
                    <li><FaCheckCircle className="check-icon" /> Search & Filter by City, Budget, or Hotel Type</li>
                </ul>

                <h2>Tech Stack</h2>
                <div className="tech-stack">
                    <SiMongodb className="tech-icon mongo" />
                    <SiExpress className="tech-icon express" />
                    <FaReact className="tech-icon react" />
                    <FaNode className="tech-icon node" />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;
