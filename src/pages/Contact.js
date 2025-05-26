import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../Footer';

const Contact = () => {
    return (
        <div>
            <Navbar />
            <div className="contact-container">
                <h2>Contact Us</h2>

                <div className="contact-content">
                    <form className="contact-form">
                        <input type="text" placeholder="Your Name" required />
                        <input type="email" placeholder="Your Email" required />
                        <textarea placeholder="Your Message" rows="5" required></textarea>
                        <button type="submit">Send Message</button>
                    </form>

                    <div className="contact-map">
                        <iframe
                            title="Tripinary Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d823.0158414740825!2d77.52269932321846!3d28.423957118637933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cc1cc44695e9d%3A0x95509233dc6b4d02!2sSKD%20Volleyball%20Court!5e0!3m2!1sen!2sin!4v1747291507938!5m2!1sen!2sin"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
