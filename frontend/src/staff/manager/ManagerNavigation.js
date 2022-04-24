import {Nav} from "react-bootstrap";
import {Link} from "react-router-dom";
import {MdBook, MdCreate, MdDashboard, MdElectricScooter, MdManageAccounts, MdSettings} from "react-icons/md";
import {FaExclamation, FaPercentage} from "react-icons/fa";
import React from "react";
import {RiBuilding3Fill} from "react-icons/ri";
import {IoIosStats} from "react-icons/io";

const ManagerNavigation = () => {
    return (
        <Nav
            defaultActiveKey="#/dashboard"
            variant="pills"
            className="manager-vert-navbar"
            style={{paddingLeft: "15px", color: "black"}}
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
        </Nav>
    );
}

export default ManagerNavigation;
