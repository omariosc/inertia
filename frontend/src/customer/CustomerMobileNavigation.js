import React, {useState} from "react";
import {Link, useOutletContext} from "react-router-dom";
import {Nav} from "react-bootstrap";
import {MdCreate, MdDashboard, MdElectricScooter, MdManageAccounts, MdSettings} from "react-icons/md";
import {FaExclamation} from "react-icons/fa";
import {RiBuilding3Fill} from "react-icons/ri";
import {IoIosStats} from "react-icons/io";
import {GiHamburgerMenu} from "react-icons/gi";
import {CgClose} from "react-icons/cg";

export default function CustomerMobileNavigation() {
    const [open, setOpen] = useState(false);
    const hamburgerIcon = <GiHamburgerMenu className="hamburger-menu-customer" color="black" size="35px"
                                           onClick={() => setOpen(!open)}/>
    const closeIcon = <CgClose className="hamburger-menu-customer" color="black" size="35px" onClick={() => setOpen(!open)}/>
    const [signOut] = useOutletContext();

    function Links () {
        return (
            <Nav defaultActiveKey="#/create-bookings" className="customer-navigation-mobile align-items-begin">
                <Nav.Link as={Link} className="hover-white" to="/create-booking">Create Booking</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/current-bookings">Current
                    Bookings</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/booking-history">Booking History</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/submit-issue">Submit Issue</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/discounts">Discounts</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/settings">Settings</Nav.Link>
                <Nav.Link as={Link} className="hover-white" to="/" onClick={signOut} >Sign Out</Nav.Link>
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
