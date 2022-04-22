import React from "react";
import {Outlet, useOutletContext, Link} from 'react-router-dom';
import {Col, Dropdown, DropdownButton, Nav, Navbar, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {MdDashboard, MdElectricScooter, MdSettings, MdBook} from "react-icons/md"
import {FaExclamation, FaPercentage} from "react-icons/fa";
import Cookies from 'universal-cookie';

export default function EmployeeInterface() {
    const cookies = new Cookies();
    const [signOut] = useOutletContext();

    return (
        <div id="overlay">
            <div className="clickable">
                <Navbar style={{backgroundColor: "black"}} expand="lg" className="clickable">
                    <Navbar.Brand style={{
                        paddingLeft: "15px",
                        fontSize: "35px",
                        color: "white"
                    }} as={Link} to="/dashboard"><b>INERTIA</b></Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text style={{color: "white"}} className="navbar-pad-right">
                            Logged in as: <a style={{color: "white"}}>{cookies.get("accountName")}</a>
                        </Navbar.Text>
                        <Nav.Item className="navbar-pad-right">
                            <DropdownButton
                                align="end"
                                className="dropdown-basic-button"
                                variant="dark"
                                title={<span><i><FontAwesomeIcon icon={faUser}/></i></span>}
                            >
                                <Dropdown.Item as={Link} to="/" onClick={signOut}>
                                    <p>Sign Out</p>
                                </Dropdown.Item>
                            </DropdownButton>
                        </Nav.Item>
                    </Navbar.Collapse>
                </Navbar>
                <Row id={"manager-row"}>
                    <Col xs={"auto"} style={{backgroundColor: "#F0F0F0"}} className="border-end border-dark">
                        <Nav
                            defaultActiveKey="/dashboard"
                            variant="pills"
                            className="manager-vert-navbar flex-column"
                            style={{paddingLeft: "15px"}}
                        >
                            <Nav.Link as={Link} to="/dashboard">
                                <MdDashboard/> Dashboard
                            </Nav.Link>
                            <Nav.Link disabled>
                                <MdBook/> Bookings
                            </Nav.Link>
                            <Nav.Link as={Link} to="/create-guest-booking" className={"nav-indented"}>
                                Create Booking
                            </Nav.Link>
                            <Nav.Link as={Link} to="/booking-applications" className={"nav-indented"}>
                                Booking Applications
                            </Nav.Link>
                            <Nav.Link as={Link} to="/ongoing-bookings" className={"nav-indented"}>
                                Ongoing Bookings
                            </Nav.Link>
                            <Nav.Link as={Link} to="/booking-history" className={"nav-indented"}>
                                Booking History</Nav.Link>
                            <Nav.Link as={Link} to="/scooter-management">
                                <MdElectricScooter/> Scooter Management</Nav.Link>
                            <Nav.Link disabled>
                                <FaExclamation/> Issues
                            </Nav.Link>
                            <Nav.Link as={Link} to="/submit-issue" className={"nav-indented"}>
                                Submit Issue</Nav.Link>
                            <Nav.Link as={Link} to="/manage-issues" className={"nav-indented"}>
                                Manage Issues</Nav.Link>
                            <Nav.Link as={Link} to="/discount-applications">
                                <FaPercentage/> Discount Applications
                            </Nav.Link>
                            <Nav.Link as={Link} to="/settings">
                                <MdSettings/> Settings
                            </Nav.Link>
                        </Nav>
                    </Col>
                    <Col xs={9}>
                        <Outlet context={[signOut]}/>
                    </Col>
                </Row>
            </div>
        </div>
    );
};