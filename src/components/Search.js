import React, { useState } from 'react';

const Search = ({ onSearch }) => {
    const [city, setCity] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim() !== '') {
            onSearch(city);
        }
    };

    return (
        <form className="searchContainer" onSubmit={handleSubmit}>
            <div className='searchDiv'>
                <input
                    className='search'
                    type="text"
                    placeholder="Enter City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button className='btnS' type="submit">
                    Search
                </button>
            </div>
        </form>
    );
};

export default Search;
