import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../Footer';

const ShareExperience = () => {
    const [formData, setFormData] = useState({
        destination: '',
        tripBudget: '',
        hotelType: '',
        hotelBudget: '',
        hotelName: '',
        placesVisited: [{ name: '', budget: '' }],
        adventureSports: [{ name: '', budget: ''}],
    });

    const [errors, setErrors] = useState('');
    const [success, setSuccess] = useState('');

    const priceRanges = {
        standard: { min: 500, max: 2500 },
        premium: { min: 2500, max: 6000 },
        luxury: { min: 6000, max: 15000 },
    };

    const handleChange = (e, index, field) => {
        if (field === 'placesVisited' || field === 'adventureSports') {
            const updated = [...formData[field]];
            updated[index][e.target.name] = e.target.value;
            setFormData({ ...formData, [field]: updated });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const addField = (field) => {
        if (field === 'placesVisited') {
            setFormData({ ...formData, placesVisited: [...formData.placesVisited, { name: '', budget: '' }] });
        } else if (field === 'adventureSports') {
            setFormData({ ...formData, adventureSports: [...formData.adventureSports, { name: '', budget: '' }] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { hotelType, hotelBudget, placesVisited, adventureSports, tripBudget } = formData;
        const selectedRange = priceRanges[hotelType.toLowerCase()];

        if (!selectedRange) {
            setErrors('Please select a valid hotel type.');
            return;
        }

        const hotelBudgetNum = parseInt(hotelBudget);

        if (
            isNaN(hotelBudgetNum) ||
            hotelBudgetNum < selectedRange.min ||
            hotelBudgetNum > selectedRange.max
        ) {
            setErrors(
                `For ${hotelType} hotels, please enter a budget between ₹${selectedRange.min} and ₹${selectedRange.max}`
            );
            return;
        }

        const placesVisitedCost = placesVisited.reduce((sum, place) => sum + parseInt(place.budget || 0), 0);
        const adventureSportsCost = adventureSports.reduce((sum, sport) => sum + parseInt(sport.budget || 0), 0);
        const totalCost = hotelBudgetNum + placesVisitedCost + adventureSportsCost;

        if (totalCost > parseInt(tripBudget)) {
            setErrors(`Total cost of your experience exceeds your overall trip budget.`);
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/experience', formData);
            setSuccess('Experience shared successfully!');
            setErrors('');
            setFormData({
                destination: '',
                tripBudget: '',
                hotelType: '',
                hotelBudget: '',
                hotelName: '',
                placesVisited: [{ name: '', budget: '' }],
                adventureSports: [{ name: '', budget: '' }],
            });
        } catch (err) {
            console.error(err);
            setErrors('Something went wrong while submitting.');
            setSuccess('');
        }
    };

    return (
        <div className="share-experience-form">
            <Navbar />
            <h2>Share your experience with us...</h2>
            {errors && <p style={{ color: 'red' }}>{errors}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <div className="formContainer">
                <form onSubmit={handleSubmit} >
                    <div className="form">
                    <div className="formB1">
                        <input
                            type="text"
                            name="destination"
                            placeholder="Enter your destination"
                            value={formData.destination}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="number"
                            name="tripBudget"
                            placeholder="Your Overall Trip Budget"
                            value={formData.tripBudget}
                            onChange={handleChange}
                            required
                        />

                        <select name="hotelType" value={formData.hotelType} onChange={handleChange} required>
                            <option value="">Select Hotel Type</option>
                            <option value="standard">Standard</option>
                            <option value="premium">Premium</option>
                            <option value="luxury">Luxury</option>
                        </select>
                    </div>

                    <div className="formB2">
                        {formData.hotelType && (
                            <p>
                                Price Range: ₹{priceRanges[formData.hotelType]?.min} – ₹{priceRanges[formData.hotelType]?.max}
                            </p>
                        )}

                        <input
                            type="number"
                            name="hotelBudget"
                            placeholder="Hotel Price per Night"
                            value={formData.hotelBudget}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="hotelName"
                            placeholder="Hotel Name"
                            value={formData.hotelName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="formB3">
                    <h4>Places Visited</h4>
                    {formData.placesVisited.map((place, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                name="name"
                                value={place.name}
                                onChange={(e) => handleChange(e, index, 'placesVisited')}
                                placeholder={`Place ${index + 1}`}
                                required
                                />

                            <input
                                type="number"
                                name="budget"
                                value={place.budget}
                                onChange={(e) => handleChange(e, index, 'placesVisited')}
                                placeholder={`Budget for Place ${index + 1}`}
                                required
                                />
                        </div>
                    ))}
                    <button
                        className='formBtn'
                        type="button"
                        onClick={() => addField('placesVisited')}
                    >
                        + Add Place
                    </button>
                    </div>


                    <div className="formB4">
                    <h4>Adventure Sports</h4>
                    {formData.adventureSports.map((sport, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                name="name"
                                value={sport.name}
                                onChange={(e) => handleChange(e, index, 'adventureSports')}
                                placeholder={`Adventure ${index + 1}`}
                                />

                            <input
                                type="number"
                                name="budget"
                                value={sport.budget}
                                onChange={(e) => handleChange(e, index, 'adventureSports')}
                                placeholder={`Budget for Adventure ${index + 1}`}
                                />
                        </div>
                    ))}
                    <button
                        className='formBtn'
                        type="button"
                        onClick={() => addField('adventureSports')}
                    >
                        + Add Adventure
                    </button>
                    </div>

                    <br />

                    <button
                        className='formBtn'
                        type="submit"
                    >
                        Submit
                    </button>
            </div>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default ShareExperience;
