/*
	Purpose of file: Navigation bar for customers
*/

import React from "react";
import {Link} from "react-router-dom";
import {Nav} from "react-bootstrap";

/**
 * Returns the navigation bar for customers to browse the application
 */
export default function CustomerNavigation() {
    return (
        <Nav defaultActiveKey="#/create-bookings" className="customer-navigation align-items-end">
            <Nav.Link as={Link} className="hover-black" to="/create-booking">Create Booking</Nav.Link>
            <Nav.Link as={Link} className="hover-black" to="/current-bookings">Current
                Bookings</Nav.Link>
            <Nav.Link as={Link} className="hover-black" to="/booking-history">Booking History</Nav.Link>
            <Nav.Link as={Link} className="hover-black" to="/submit-issue">Submit Issue</Nav.Link>
            <Nav.Link as={Link} className="hover-black" to="/discounts">Discounts</Nav.Link>
            <Nav.Link as={Link} className="hover-black" to="/settings">Settings</Nav.Link>
        </Nav>
    );
}