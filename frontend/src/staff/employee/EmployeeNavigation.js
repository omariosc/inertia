/*
	Purpose of file: Navigation bar for employees
*/

import React from "react";
import {Link} from "react-router-dom";
import {Nav} from "react-bootstrap";
import {MdBook, MdDashboard, MdElectricScooter, MdSettings} from "react-icons/md";
import {FaExclamation, FaPercentage} from "react-icons/fa";

/**
 * Renders the employee navigation bar with links for browsing the application
 * @returns Default employee navbar
 */
export default function EmployeeNavigation() {
    return (
        <Nav defaultActiveKey="/home" variant="pills"
             className="manager-vert-navbar flex-column medium-padding-left">
            <Nav.Link as={Link} to="/home">
                <MdDashboard/> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/bookings">
                <MdBook/> Bookings
            </Nav.Link>
            <Nav.Link as={Link} to="/create-guest-booking" className="nav-indented">
                Create Booking
            </Nav.Link>
            <Nav.Link as={Link} to="/booking-applications" className="nav-indented">
                Booking Applications
            </Nav.Link>
            <Nav.Link as={Link} to="/booking-history" className="nav-indented">
                Booking History</Nav.Link>
            <Nav.Link as={Link} to="/scooter-management">
                <MdElectricScooter/> Scooter Management</Nav.Link>
            <Nav.Link as={Link} to="/issues">
                <FaExclamation/> Issues
            </Nav.Link>
            <Nav.Link as={Link} to="/submit-issue" className="nav-indented">
                Submit Issue</Nav.Link>
            <Nav.Link as={Link} to="/discount-applications">
                <FaPercentage/> Discount Applications
            </Nav.Link>
            <Nav.Link as={Link} to="/settings">
                <MdSettings/> Settings
            </Nav.Link>
        </Nav>
    );
}