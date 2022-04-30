/*
	Purpose of file: General framework for the customer interface
*/

import React from "react";
import {Outlet, Link} from 'react-router-dom';
import {Row, Col, Nav} from "react-bootstrap";
import UserMenu from '../components/UserMenu';
import CustomerNavigation from "./CustomerNavigation";
import CustomerMobileNavigation from "./CustomerMobileNavigation";

/**
 * Returns the boilerplate required for the customer interface
 */
export default function CustomerInterface() {
    const headers = {
        "/create-booking": "Create Booking",
        "/current-bookings": "Current Bookings",
        "/booking-history": "Booking History",
        "/submit-issue": "Submit Issue",
        "/discounts": "Discounts",
        "/settings": "Settings",
    };
    function getPathName() {
        if (!headers[location.pathname]) {
            if (location.pathname.includes('extend')) {
                return "Extend Booking";
            }
            if (location.pathname.includes('cancel')) {
                return "Cancel Booking";
            }
        } else {
            return headers[location.pathname];
        }
    }
    return (
        <div id="overlay">
            <div id="top-bar" className="dropDownMenu">
                <UserMenu/>
            </div>
            <div id="account-page">
                <Row>
                    <Col lg={4} xs={12} className="customer-column border-dark"
                         style={{borderRight: "1px solid black"}}>
                        <Nav.Link as={Link} className="customer-home hover-black" to="/"><h1>INERTIA</h1>
                        </Nav.Link>
                    </Col>
                    <Col lg={8} xs={12} className="customer-column-page">
                        <h3>{getPathName()}</h3>
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
                        <Outlet/>
                    </Col>
                </Row>
            </div>
        </div>
    );
};