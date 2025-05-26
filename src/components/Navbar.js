import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Search from './Search';

const Navbar = ({ onSearch }) => {
    const location = useLocation();

    return (
        <nav className='navbar'>
            <NavLink to="/" className="logo">
                <img src="/logo.jpg" alt="" className='logoimg' />
            </NavLink>
            <div className='navL'>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/tripPlanner">Trip Planner</NavLink>
                <NavLink to="/suggestion">Share Experience</NavLink>
                <NavLink to="/about">About Us</NavLink>
                <NavLink to="/contact">Contact Us</NavLink>
            </div>
            <div className='navR'>
                {location.pathname === '/' && (
                    <Search onSearch={onSearch} />
                )}
            </div>
        </nav>
    );
};

export default Navbar;
