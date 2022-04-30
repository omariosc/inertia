/*
	Purpose of file: Navigation bar for customers on mobile devices
*/

import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Nav} from "react-bootstrap";
import {GiHamburgerMenu} from "react-icons/gi";
import {CgClose} from "react-icons/cg";
import {useAccount} from "../authorize";

/**
 * Returns the navigation bar for customers on mobile devices
 */
export default function CustomerMobileNavigation() {
    const [open, setOpen] = useState(false);
    const hamburgerIcon = <GiHamburgerMenu className="hamburger-menu-customer" color="black" size="35px"
                                           onClick={() => setOpen(!open)}/>
    const closeIcon = <CgClose className="hamburger-menu-customer" color="black" size="35px"
                               onClick={() => setOpen(!open)}/>
    const [account, signOut, signIn] = useAccount();
    const navigate = useNavigate();

		/**
		 * Groups the links required for the navigation bar in order
		 * to browse the application
		 */
    function Links() {
        return (
            <Nav defaultActiveKey="/create-bookings" className="customer-navigation-mobile align-items-begin">
                <Nav.Link as={Link} className="hover-white" to="/create-booking">Create Booking</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/current-bookings">Current
                    Bookings</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/booking-history">Booking History</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/submit-issue">Submit Issue</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/discounts">Discounts</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/settings">Settings</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/" onClick={() => {
                    signOut();
                    navigate('/');
                }}>Sign Out</Nav.Link>
            </Nav>
        );
    }

    return (
        <div>
            {open ? closeIcon : hamburgerIcon}
            {open && <Links/>}
        </div>
    );
}
