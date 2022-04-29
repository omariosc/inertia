import React from "react";
import {useLocation, useOutletContext, Outlet, Link} from 'react-router-dom';
import {Row, Col, Nav, DropdownButton, Dropdown} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import CustomerNavigation from "./CustomerNavigation";
import CustomerMobileNavigation from "./CustomerMobileNavigation";

export default function CustomerInterface() {
    let location = useLocation();
    const [signOut] = useOutletContext();
    const headers = {
        "/create-booking": "Create Booking",
        "/current-bookings": "Current Bookings",
        "/booking-history": "Booking History",
        "/submit-issue": "Submit Issue",
        "/discounts": "Discounts",
        "/settings": "Settings",
    };

    return (
        <div id="overlay">
            <div id="top-bar">
                <DropdownButton
                    align="end"
                    title={<span><i><FontAwesomeIcon icon={faUser}/></i></span>}
                    className="customer-logout float-right clickable"
                >
                    <Dropdown.Item as={Link} to="/" onClick={signOut}>Sign Out</Dropdown.Item>
                </DropdownButton>
            </div>
            <div id="account-page">
                <Row>
                    <Col lg={4} xs={12} className="customer-column border-dark"
                         style={{borderRight: "1px solid black"}}>
                        <Nav.Link as={Link} className="customer-home hover-black" to="/create-booking"><h1>INERTIA</h1>
                        </Nav.Link>
                    </Col>
                    <Col lg={8} xs={12} className="customer-column-page">
                        <h3>{headers[location.pathname]}</h3>
                        <hr/>
                    </Col>
                </Row>
                <Row id="customer-row">
                    <Col lg={4} md={"auto"} xs={"auto"} className="customer-column border-dark"
                         style={{borderRight: "1px solid black"}}>
                        <CustomerNavigation/>
                        <CustomerMobileNavigation/>
                    </Col>
                    <Col lg={8} xs={12}>
                        <Outlet context={[signOut]}/>
                    </Col>
                </Row>
            </div>
        </div>
    );
};