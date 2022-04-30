/*
	Purpose of file: Navigation for employee accounts on mobile devices
*/

import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Nav} from "react-bootstrap";
import {MdBook, MdDashboard, MdElectricScooter, MdSettings} from "react-icons/md";
import {FaExclamation, FaPercentage} from "react-icons/fa";
import {GiHamburgerMenu} from "react-icons/gi";
import {CgClose} from "react-icons/cg";
import {useAccount} from "../../authorize";

/**
 * Returns the employee navigation bar with links for browsing the application
 * on mobile devices
 */
export default function EmployeeMobileNavigation() {
    const [open, setOpen] = useState(false);
    const hamburgerIcon = <GiHamburgerMenu className="hamburger-menu-staff" color="white" size="35"
                                           onClick={() => setOpen(!open)}/>
    const closeIcon = <CgClose className="hamburger-menu-staff" color="white" size="35" onClick={() => setOpen(!open)}/>
    const [, signOut, ] = useAccount();
    const navigate = useNavigate();

		/**
		 * Groups the different links required for the navigation bar
		 */
    function Links() {
        return (
            <Nav
                defaultActiveKey="/home" variant="pills"
                className="manager-vert-navbar-mobile flex-column medium-padding-left"
            >
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
                <Nav.Link as={Link} to="/" onClick={() => {
                    signOut();
                    navigate('/');
                }}>
                    Sign Out</Nav.Link>
            </Nav>);
    }

    return (
        <div>
            {open ? closeIcon : hamburgerIcon}
            {open && <Links/>}
        </div>
    );
}