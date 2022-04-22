import React from "react";
import {useLocation, useOutletContext, Outlet, Link} from 'react-router-dom';
import {Row, Col, Nav, DropdownButton, Dropdown} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import '../App.css';

export default function CustomerInterface() {
    let location = useLocation();
    const [signOut] = useOutletContext();
    const headers = {
        "/create-booking": "Create Booking",
        "/current-bookings": "Current Bookings",
        "/booking-history": "Booking History",
        "/submit-issue": "Submit Issue",
        "/discounts": "Discounts",
        "/settings": "Settings"
    };

    return (
        <div id="overlay">
            <div id="top-bar">
                <DropdownButton
                    align="end"
                    title={<span><i><FontAwesomeIcon icon={faUser}/></i></span>}
                    className="dropdown-basic-button clickable"
                >
                    <Dropdown.Item as={Link} to="/" onClick={signOut}>
                        <p>Sign Out</p>
                    </Dropdown.Item>
                </DropdownButton>
            </div>
            <div id="account-page">
                <Row>
                    <Col lg={4} xs={12} className="customer-column border-end border-dark">
                        <Nav.Link as={Link} to="/create-booking"><h1>INERTIA</h1></Nav.Link>
                    </Col>
                    <Col lg={8} xs={12} className="customer-column-page">
                        <h4>{headers[location.pathname]}</h4>
                    </Col>
                </Row>
                <Row id={"customer-row"}>
                    <Col lg={4} xs={12} className="customer-column border-end border-dark">
                        <Nav defaultActiveKey="#/create-bookings" className="customer-navigation align-items-end">
                            <Nav.Link as={Link} to="/create-booking">Create Booking</Nav.Link>
                            <Nav.Link as={Link} to="/current-bookings">Current Bookings</Nav.Link>
                            <Nav.Link as={Link} to="/booking-history">Booking History</Nav.Link>
                            <Nav.Link as={Link} to="/submit-issue">Submit Issue</Nav.Link>
                            <Nav.Link as={Link} to="/discounts">Discounts</Nav.Link>
                            <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
                        </Nav>
                    </Col>
                    <Col lg={8} xs={12}>
                        <Outlet context={[signOut]}/>
                    </Col>
                </Row>
            </div>
        </div>
    );
};