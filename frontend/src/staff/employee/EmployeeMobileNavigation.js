import React, {useState} from "react";
import {Nav} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {Link} from "react-router-dom";
import {MdBook, MdDashboard, MdElectricScooter, MdSettings} from "react-icons/md";
import {FaExclamation, FaPercentage} from "react-icons/fa";
import {GiHamburgerMenu} from "react-icons/gi";
import {CgClose} from "react-icons/cg";

export default function EmployeeMobileNavigation() {
    const [open, setOpen] = useState(false);
    const hamburgerIcon = <GiHamburgerMenu className="hamburger-menu" color="white" size="35"
                                           onClick={() => setOpen(!open)}/>
    const closeIcon = <CgClose className="hamburger-menu" color="white" size="35" onClick={() => setOpen(!open)}/>

    function Links() {
        return (
            <Nav
                defaultActiveKey="/dashboard"
                variant="pills"
                className="manager-vert-navbar-mobile flex-column medium-padding-left"
            >
                <Nav.Link as={Link} to="/dashboard">
                    <MdDashboard/> Dashboard
                </Nav.Link>
                <Nav.Link disabled>
                    <MdBook/> Bookings
                </Nav.Link>
                <Nav.Link as={Link} to="/create-guest-booking" className="nav-indented">
                    Create Booking
                </Nav.Link>
                <Nav.Link as={Link} to="/booking-applications" className="nav-indented">
                    Booking Applications
                </Nav.Link>
                <Nav.Link as={Link} to="/ongoing-bookings" className="nav-indented">
                    Ongoing Bookings
                </Nav.Link>
                <Nav.Link as={Link} to="/booking-history" className="nav-indented">
                    Booking History</Nav.Link>
                <Nav.Link as={Link} to="/scooter-management">
                    <MdElectricScooter/> Scooter Management</Nav.Link>
                <Nav.Link disabled>
                    <FaExclamation/> Issues
                </Nav.Link>
                <Nav.Link as={Link} to="/submit-issue" className="nav-indented">
                    Submit Issue</Nav.Link>
                <Nav.Link as={Link} to="/manage-issues" className="nav-indented">
                    Manage Issues</Nav.Link>
                <Nav.Link as={Link} to="/discount-applications">
                    <FaPercentage/> Discount Applications
                </Nav.Link>
                <Nav.Link as={Link} to="/settings">
                    <MdSettings/> Settings
                </Nav.Link>
            </Nav>);
    }

    return (
        <div>
            {open ? closeIcon : hamburgerIcon}
            {open && <Links/>}
        </div>
    );
}