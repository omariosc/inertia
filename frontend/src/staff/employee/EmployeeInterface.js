import React from "react";
import {Outlet, useOutletContext, Link} from 'react-router-dom';
import {Col, Dropdown, DropdownButton, Nav, Navbar, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js"
import EmployeeMobileNavigation from "./EmployeeMobileNavigation";
import EmployeeNavigation from "./EmployeeNavigation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
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
                        <Nav.Item className="dropdown-toggle navbar-pad-right">
                            <DropdownButton
                                align="end"
                                className="dropdown-basic-button"
                                variant="dark"
                                title={<span><i><FontAwesomeIcon icon={faUser}/></i></span>}
                            >
                                <Dropdown.Item as={Link} to="/" onClick={signOut}>Sign Out</Dropdown.Item>
                            </DropdownButton>
                        </Nav.Item>
                    </Navbar.Collapse>
                </Navbar>
                <Row id="manager-row">
                    <Col xs="auto" className="staff-nav-column border-end border-dark">
                        <EmployeeMobileNavigation/>
                        <EmployeeNavigation/>
                    </Col>
                    <Col xs={9}>
                        <Outlet context={[signOut]}/>
                    </Col>
                </Row>
            </div>
        </div>
    );
};