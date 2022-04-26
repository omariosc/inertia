import React from "react";
import {Link} from "react-router-dom";
import {Nav} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {MdBook, MdDashboard, MdElectricScooter, MdSettings} from "react-icons/md";
import {FaExclamation, FaPercentage} from "react-icons/fa";

export default function EmployeeNavigation() {

    return (
                <Nav defaultActiveKey="/dashboard" variant="pills"
             className="manager-vert-navbar flex-column medium-padding-left">
            <Nav.Link as={Link} to="/dashboard">
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