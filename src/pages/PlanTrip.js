import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import Navbar from '../components/Navbar';
import Footer from '../Footer';

const TripPlanner = () => {
    const [city, setCity] = useState('');
    const [hotelType, setHotelType] = useState('');
    const [allExperiences, setAllExperiences] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);

    const [placesToShow, setPlacesToShow] = useState([]);
    const [adventuresToShow, setAdventuresToShow] = useState([]);

    const [selectedPlaces, setSelectedPlaces] = useState([]);
    const [selectedAdventures, setSelectedAdventures] = useState([]);

    const [placeBudgets, setPlaceBudgets] = useState({});
    const [adventureBudgets, setAdventureBudgets] = useState({});
    const [totalBudget, setTotalBudget] = useState(0);

    const [itineraryPreview, setItineraryPreview] = useState(null);
    const itineraryRef = useRef();

    const handleCitySearch = async () => {
        try {
            const res = await axios.get(`https://tripinary-backend.onrender.com/api/experience/${city}`);
            setAllExperiences(res.data);

            const placeBudgetMap = {};
            const adventureBudgetMap = {};

            res.data.forEach(exp => {
                (exp.placesVisited || []).forEach(place => {
                    const name = typeof place === 'string' ? place : place.name;
                    if (name && !placeBudgetMap[name]) {
                        placeBudgetMap[name] = place.budget || 0;
                    }
                });
                (exp.adventureSports || []).forEach(adventure => {
                    const name = typeof adventure === 'string' ? adventure : adventure.name;
                    if (name && !adventureBudgetMap[name]) {
                        adventureBudgetMap[name] = adventure.budget || 0;
                    }
                });
            });

            setPlaceBudgets(placeBudgetMap);
            setAdventureBudgets(adventureBudgetMap);

            const allPlaces = [
                ...new Map(
                    res.data.flatMap(exp => exp.placesVisited || []).map(place => [
                        typeof place === 'string' ? place : place.name,
                        typeof place === 'string' ? { name: place } : place
                    ])
                ).values()
            ];

            const allAdventures = [
                ...new Map(
                    res.data.flatMap(exp => exp.adventureSports || []).map(sport => [
                        typeof sport === 'string' ? sport : sport.name,
                        typeof sport === 'string' ? { name: sport } : sport
                    ])
                ).values()
            ];

            setPlacesToShow(allPlaces);
            setAdventuresToShow(allAdventures);
            setFilteredHotels([]);
            setHotelType('');
            setSelectedHotel(null);
            setItineraryPreview(null);
            setSelectedPlaces([]);
            setSelectedAdventures([]);
        } catch (err) {
            console.error(err);
            alert('Error fetching experiences.');
        }
    };

    useEffect(() => {
        let total = 0;
        if (selectedHotel) total += selectedHotel.hotelBudget || 0;
        selectedPlaces.forEach(place => {
            const name = place.name || place;
            total += placeBudgets[name] || 0;
        });
        selectedAdventures.forEach(adventure => {
            const name = adventure.name || adventure;
            total += adventureBudgets[name] || 0;
        });
        setTotalBudget(total);
    }, [selectedHotel, selectedPlaces, selectedAdventures, placeBudgets, adventureBudgets]);

    const handleHotelFilter = () => {
        const filtered = allExperiences.filter(exp => exp.hotelType === hotelType);
        setFilteredHotels(filtered);
        setSelectedHotel(null);
        setItineraryPreview(null);
    };

    const handleCreateItinerary = () => {
        if (!selectedHotel) {
            alert("Please select a hotel first!");
            return;
        }

        const allActivities = [...selectedPlaces, ...selectedAdventures];
        const days = [];
        for (let i = 0; i < allActivities.length; i += 4) {
            days.push(allActivities.slice(i, i + 4));
        }

        setItineraryPreview({ hotel: selectedHotel, days });
    };

    const togglePlace = (place) => {
        if (selectedPlaces.some(p => p.name === place.name)) {
            setSelectedPlaces(selectedPlaces.filter(p => p.name !== place.name));
        } else {
            setSelectedPlaces([...selectedPlaces, place]);
        }
    };

    const toggleAdventure = (adv) => {
        if (selectedAdventures.some(a => a.name === adv.name)) {
            setSelectedAdventures(selectedAdventures.filter(a => a.name !== adv.name));
        } else {
            setSelectedAdventures([...selectedAdventures, adv]);
        }
    };


    const isAdded = (item, selectedList) => selectedList.some(p => p.name === item.name);

    const scroll = (ref, direction) => {
        if (ref.current) {
            const scrollAmount = 520;
            ref.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
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

    const hotelScrollRef = useRef();
    const placeScrollRef = useRef();
    const adventureScrollRef = useRef();


    return (
        <>
        <Navbar />
        <div className="trip-planner">
            <h2>Plan Your Trip</h2>
            <div className="search-form">
                <input type="text" placeholder="Enter City" value={city} onChange={(e) => setCity(e.target.value)} />
                <button onClick={handleCitySearch}>Search</button>


                {allExperiences.length > 0 && (
                    <div className="filter-section">
                        <label>Select Hotel Type:</label>
                        <select value={hotelType} onChange={(e) => setHotelType(e.target.value)}>
                            <option value="">Select</option>
                            <option value="standard">Standard</option>
                            <option value="premium">Premium</option>
                            <option value="luxury">Luxury</option>
                        </select>
                        <button onClick={handleHotelFilter}>Filter Hotels</button>
                    </div>
                )}
            </div>

            {filteredHotels.length > 0 && (
                <div className="hotel-section">
                    <div className="section-header">
                        <h3>Available Hotels</h3>
                        <div className="scroll-btn-group">
                            <button className="scroll-btn" onClick={() => scroll(hotelScrollRef, 'left')}>◀</button>
                            <button className="scroll-btn" onClick={() => scroll(hotelScrollRef, 'right')}>▶</button>
                        </div>
                    </div>
                    <div className="scroll-container" ref={hotelScrollRef}>
                        {filteredHotels.map((exp, index) => (
                            <div key={index} className={`card hotel-card ${selectedHotel === exp ? 'selected' : ''}`}>
                                <img src={`https://tripinary-backend.onrender.com/hotelImages/${exp.hotelImage}`} alt="Hotel" loading='lazy' />
                                <h4>{exp.hotelName}</h4>
                                <p>₹{exp.hotelBudget}/per night</p>
                                <button onClick={() => setSelectedHotel(exp)}>Select</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {placesToShow.length > 0 && (
                <div className='experience-section'>
                    <div className="section-header">
                        <h3>Places to Visit</h3>
                        <div className="scroll-btn-group">
                            <button className="scroll-btn" onClick={() => scroll(placeScrollRef, 'left')}>◀</button>
                            <button className="scroll-btn" onClick={() => scroll(placeScrollRef, 'right')}>▶</button>
                        </div>
                    </div>
                    <div className="scroll-container" ref={placeScrollRef}>
                        {placesToShow.map((place, i) => (
                            <div key={i} className='card'>
                                <img src={`https://tripinary-backend.onrender.com/placeImages/${place.placeImage}`} alt={place.name} loading='lazy'/>
                                <h4>{place.name}</h4>
                                <p>₹{place.budget}</p>
                                <button onClick={() => togglePlace(place)}>
                                    {isAdded(place, selectedPlaces) ? 'Remove' : 'Add'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {adventuresToShow.length > 0 && (
                <div className='experience-section'>
                    <div className="section-header">
                        <h3>Adventure Sports</h3>
                        <div className="scroll-btn-group">
                            <button className="scroll-btn" onClick={() => scroll(adventureScrollRef, 'left')}>◀</button>
                            <button className="scroll-btn" onClick={() => scroll(adventureScrollRef, 'right')}>▶</button>
                        </div>
                    </div>
                    <div className="scroll-container" ref={adventureScrollRef}>
                        {adventuresToShow.map((adv, i) => (
                            <div key={i} className='card'>
                                <img src={`https://tripinary-backend.onrender.com/sportImages/${adv.sportImage}`} alt={adv.name} loading='lazy'/>
                                <h4>{adv.name}</h4>
                                <p>₹{adv.budget}</p>
                                <button onClick={() => toggleAdventure(adv)}>
                                    {isAdded(adv, selectedAdventures) ? 'Remove' : 'Add'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            <h4 className="total-budget">Total Package Cost: ₹{totalBudget}</h4>

            <div className="createI">
                {selectedHotel && (selectedPlaces.length > 0 || selectedAdventures.length > 0) && (
                    <button className='btn' onClick={handleCreateItinerary}>Create Itinerary</button>
                )}
            </div>

            {itineraryPreview && (
                <div className='popup-overlay'>
                    <div ref={itineraryRef} className="popup-box">
                        <div className="popb1">
                            <h2>Your Itinerary</h2>
                            <button className="btnC exclude-from-pdf" onClick={() => setItineraryPreview(null)}>❌</button>
                        </div>
                        <div className="popb2">
                            <img src={`https://tripinary-backend.onrender.com/hotelImages/${itineraryPreview.hotel.hotelImage}`} alt="hotel" loading='lazy'/>
                            <h3>{itineraryPreview.hotel.hotelName}</h3>
                        </div>
                        <div className="popb4">
                            <h3>📅 Day-wise Itinerary</h3>
                            {itineraryPreview.days.map((day, index) => (
                                <div key={index}>
                                    <h4>Day {index + 1}</h4>
                                    <ul>
                                        {day.map((activity, idx) => (
                                            <li key={idx}>{activity.name || activity}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                            <h4>Total Budget: ₹{totalBudget}</h4>
                            <button className='btn exclude-from-pdf' onClick={async () => {
                                const image = itineraryRef.current.querySelector('img');
                                if (!image) return;

                                try {
                                    const base64 = await convertImageToBase64(image.src);
                                    image.src = base64;

                                    const elementsToHide = itineraryRef.current.querySelectorAll('.exclude-from-pdf');
                                    elementsToHide.forEach(el => el.style.display = 'none');

                                    const popupBox = itineraryRef.current;
                                    const originalHeight = popupBox.style.height;
                                    const originalOverflow = popupBox.style.overflow;

                                    popupBox.style.height = 'auto';
                                    popupBox.style.overflow = 'visible';

                                    setTimeout(() => {
                                        html2pdf().from(itineraryRef.current).set({
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
                </div>
            )}
        </div>
        <Footer />
        </>
    );
};

export default TripPlanner;