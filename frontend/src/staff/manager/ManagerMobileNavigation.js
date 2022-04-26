import React, {useState} from "react";
import {Link, useOutletContext} from "react-router-dom";
import {Nav} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {MdCreate, MdDashboard, MdElectricScooter, MdManageAccounts, MdSettings} from "react-icons/md";
import {FaExclamation} from "react-icons/fa";
import {GiHamburgerMenu} from "react-icons/gi";
import {CgClose} from "react-icons/cg";
import {RiBuilding3Fill} from "react-icons/ri";
import {IoIosStats} from "react-icons/io";

export default function ManagerMobileNavigation() {
    const [open, setOpen] = useState(false);
    const hamburgerIcon = <GiHamburgerMenu className="hamburger-menu" color="white" size="35"
                                           onClick={() => setOpen(!open)}/>
    const closeIcon = <CgClose className="hamburger-menu" color="white" size="35" onClick={() => setOpen(!open)}/>
    const [signOut] = useOutletContext();

    function Links() {
        return (
            <Nav
                defaultActiveKey="#/dashboard"
                variant="pills"
                className="manager-vert-navbar-mobile medium-padding-left text-black"
            >
                <Nav.Link as={Link} to="/dashboard">
                    <MdDashboard/> Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/scooter-management">
                    <MdElectricScooter/> Scooter Management
                </Nav.Link>
                <Nav.Link as={Link} to="/hire-option-management">
                    <MdCreate/> Hire Option Management
                </Nav.Link>
                <Nav.Link as={Link} to="/depot-management">
                    <RiBuilding3Fill/> Depot Management
                </Nav.Link>
                <Nav.Link as={Link} to="/issues">
                    <FaExclamation/> Issues
                </Nav.Link>
                <Nav.Link as={Link} to="/statistics">
                    <IoIosStats/> Statistics
                </Nav.Link>
                <Nav.Link as={Link} to="/account-management">
                    <MdManageAccounts/> Account Management
                </Nav.Link>
                <Nav.Link as={Link} to="/settings">
                    <MdSettings/> Settings
                </Nav.Link>
                <Nav.Link as={Link} to="/" onClick={signOut}>
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