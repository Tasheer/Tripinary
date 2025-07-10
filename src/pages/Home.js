import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { IoMdCheckmark } from "react-icons/io";
import banner from './banner.png';
import Footer from '../Footer';

const Home = () => {
    const [randomExperiences, setRandomExperiences] = useState([]);
    const [results, setResults] = useState(null);
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef();
    useEffect(() => {
        const fetchRandomExperiences = async () => {
            try {
                const res = await axios.get('https://tripinary-backend.onrender.com/api/experience/random');
                setRandomExperiences(res.data);
            } catch (error) {
                console.error('Error fetching random experiences:', error);
            }
        };

        fetchRandomExperiences();
    }, []);

    const handleSearch = async (city) => {
        try {
            const res = await axios.get(`https://tripinary-backend.onrender.com/api/experience/${city}`);
            setResults(res.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setResults([]);
        }
    };
    const convertImageToBase64 = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            };
            img.onerror = reject;
            img.src = url;
        });
    };

    const displayExperiences = results === null ? randomExperiences : results;


    const sortedItinerary = [];

    if (selectedExperience) {
        sortedItinerary.push({
            day: 1,
            activities: [`Check-in at ${selectedExperience.hotelName} hotel`],
            budget: selectedExperience.hotelBudget,
        });

        let day = 2;
        let placeIndex = 0;
        let adventureIndex = 0;

        while (placeIndex < selectedExperience.placesVisited.length || adventureIndex < selectedExperience.adventureSports.length) {
            const activities = [];
            let dayBudget = 0;

            for (let i = 0; i < 2 && placeIndex < selectedExperience.placesVisited.length; i++) {
                const place = selectedExperience.placesVisited[placeIndex];
                activities.push(`Visit ${place.name}`);
                dayBudget += place.budget;
                placeIndex++;
            }

            if (adventureIndex < selectedExperience.adventureSports.length) {
                const adv = selectedExperience.adventureSports[adventureIndex];
                activities.push(`Adventure: ${adv.name}`);
                dayBudget += adv.budget;
                adventureIndex++;
            }

            sortedItinerary.push({
                day,
                activities,
                budget: dayBudget
            });

            day++;
        }
    }
    let totalTripBudget = 0;
    if (selectedExperience) {
        totalTripBudget = sortedItinerary.reduce((acc, day) => acc + day.budget, 0);
    }

    return (
        <div>
            <Navbar onSearch={handleSearch} />
            <img src={banner} alt="" className='banner' />
            {results === null ? (
                <div className="cardContainer">
                    <h1>Featured Travel Packages</h1>
                    <div className="containerGrid">
                        {randomExperiences.map((exp, index) => (
                            <div key={index} className="homeCard">
                                <div className='cardT'>
                                    <img
                                        src={`https://tripinary-backend.onrender.com/hotelImages/${exp.hotelImage}`}
                                        alt="hotel"
                                        loading='lazy'
                                    />
                                </div>
                                <div className="cardB">
                                    <div className="box1">
                                        <span><strong>{exp.destination.charAt(0).toUpperCase() + exp.destination.slice(1)} Trip</strong></span>
                                        <span><strong>₹{exp.tripBudget}</strong></span>
                                    </div>
                                    <div className='box2'>
                                        <div>Stay at {exp.hotelName}</div>
                                        <div className='align'><IoMdCheckmark />{exp.hotelType.charAt(0).toUpperCase() + exp.hotelType.slice(1)} hotel at ₹{exp.hotelBudget}</div>
                                        <div className='align'><IoMdCheckmark />Visit to {exp.placesVisited.map((p) => `${p.name}`).join(', ')}</div>
                                        <div className='align'><IoMdCheckmark />Adventures sports - {exp.adventureSports.map((a) => `${a.name} `).join(', ')}</div>
                                    </div>
                                    <button className='btn' onClick={() => { setSelectedExperience(exp); setShowPopup(true); }}>
                                        View Full Package
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : displayExperiences.length > 0 ? (
                <div className="containerGrid">
                    {displayExperiences.map((exp, index) => (
                        <div key={index} className="card">
                            <div className="cardT">
                                <img
                                    src={`https://tripinary-backend.onrender.com/hotelImages/${exp.hotelImage}`}
                                    alt={exp.hotelName}
                                    loading='lazy'
                                />
                            </div>
                            <div className="cardB">
                                <div className="box1">
                                    <span><strong>{exp.destination.charAt(0).toUpperCase() + exp.destination.slice(1)} Trip</strong></span>
                                    <span><strong>₹{exp.tripBudget}</strong></span>
                                </div>
                                <div className="box2">
                                    <div>Stay at {exp.hotelName}</div>
                                    <div className='align'><IoMdCheckmark />{exp.hotelType.charAt(0).toUpperCase() + exp.hotelType.slice(1)} hotel at ₹{exp.hotelBudget}</div>
                                    <div className='align'><IoMdCheckmark />Visit to {exp.placesVisited.map((p) => `${p.name}`).join(', ')}</div>
                                    <div className='align'><IoMdCheckmark />Adventures sports - {exp.adventureSports.map((a) => `${a.name} `).join(', ')}</div>
                                </div>
                                <div className='btnDiv'>
                                    <button className='btn' onClick={() => { setSelectedExperience(exp); setShowPopup(true); }}>
                                        View Full Package
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No experiences found for this city.</p>
            )}

            {showPopup && selectedExperience && (
                <div className="popup-overlay">
                    <div className="popup-box" ref={popupRef}>
                        <div className="popb1">
                            <h2>{selectedExperience.destination} Trip</h2>
                            <button className='btnC exclude-from-pdf' onClick={() => setShowPopup(false)}>❌</button>
                        </div>
                        <div className="popb2">
                            <img className='img'
                                src={`https://tripinary-backend.onrender.com/hotelImages/${selectedExperience.hotelImage}`}
                                alt="hotel"
                                loading='lazy'
                            />
                            <p>{selectedExperience.hotelName}</p>
                        </div>
                        <div className="popb3">
                            <p><strong>Hotel Budget</strong> <br /> ₹{selectedExperience.hotelBudget}</p>
                            <p><strong>Places to visit</strong><br /> {selectedExperience.placesVisited.map(p => 
                                <li>
                                    {p.name} ₹{p.budget}
                                </li>
                                )}
                            </p>
                            <p><strong>Adventure Sports </strong>{selectedExperience.adventureSports.map(a => 
                                <li>
                                    {a.name} ₹{a.budget}
                                </li>
                                )}
                            </p>
                            <p><strong>Total Trip Budget:</strong> ₹{selectedExperience.tripBudget}</p>
                        </div>

                        <div className="popb4">
                            <h3>📅 Day-wise Itinerary</h3>
                            <ul>
                                {sortedItinerary.map((item, index) => (
                                    <li key={index}>
                                        <strong>Day {item.day} <br /></strong>
                                        <ul>
                                            {item.activities.map((act, i) => (
                                                <li key={i}>{act}</li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}

                            </ul>
                            <p><strong>Total Trip Budget:</strong> ₹{(() => {
                                const numberOfDays = sortedItinerary.length;
                                const hotelTotal = selectedExperience.hotelBudget * numberOfDays;

                                let activitiesTotal = 0;
                                for (let i = 1; i < sortedItinerary.length; i++) {
                                    activitiesTotal += sortedItinerary[i].budget;
                                }

                                return hotelTotal + activitiesTotal;
                            })()}</p>
                        </div>

                        <button className='btn exclude-from-pdf' onClick={async () => {
                            const image = popupRef.current.querySelector('img');
                            if (!image) return;

                            try {
                                const base64 = await convertImageToBase64(image.src);
                                image.src = base64;

                                const elementsToHide = popupRef.current.querySelectorAll('.exclude-from-pdf');
                                elementsToHide.forEach(el => el.style.display = 'none');

                                const popupBox = popupRef.current;
                                const originalHeight = popupBox.style.height;
                                const originalOverflow = popupBox.style.overflow;

                                popupBox.style.height = 'auto';
                                popupBox.style.overflow = 'visible';

                                setTimeout(() => {
                                    html2pdf().from(popupRef.current).set({
                                        margin: 0.5,
                                        filename: 'trip-package.pdf',
                                        image: { type: 'jpeg', quality: 0.98 },
                                        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
                                        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
                                    }).save().then(() => {
                                        popupBox.style.height = originalHeight;
                                        popupBox.style.overflow = originalOverflow;
                                        elementsToHide.forEach(el => el.style.display = 'block');
                                    });
                                }, 300);
                            } catch (err) {
                                console.error('Error generating PDF:', err);
                            }
                        }}>
                            Download PDF
                        </button>


                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Home;
