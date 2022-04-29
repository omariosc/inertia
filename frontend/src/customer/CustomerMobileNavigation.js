import React, {useState} from "react";
import {Link} from "react-router-dom";
import {Nav} from "react-bootstrap";
import {GiHamburgerMenu} from "react-icons/gi";
import {CgClose} from "react-icons/cg";
import signOut from '../signout';

export default function CustomerMobileNavigation() {
    const [open, setOpen] = useState(false);
    const hamburgerIcon = <GiHamburgerMenu className="hamburger-menu-customer" color="black" size="35px"
                                           onClick={() => setOpen(!open)}/>
    const closeIcon = <CgClose className="hamburger-menu-customer" color="black" size="35px"
                               onClick={() => setOpen(!open)}/>
    const [signOut] = useOutletContext();

    function Links() {
        return (
            <Nav defaultActiveKey="#/create-bookings" className="customer-navigation-mobile align-items-begin">
                <Nav.Link as={Link} className="hover-white" to="/create-booking">Create Booking</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/current-bookings">Current
                    Bookings</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/booking-history">Booking History</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/submit-issue">Submit Issue</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/discounts">Discounts</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/settings">Settings</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/" onClick={() => {
                    navigate('/');
                    signOut().then(r => r);
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
