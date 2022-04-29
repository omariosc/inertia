import React from "react";
import {Outlet, useOutletContext, Link} from 'react-router-dom';
import {Col, Dropdown, DropdownButton, Nav, Navbar, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import EmployeeMobileNavigation from "./EmployeeMobileNavigation";
import EmployeeNavigation from "./EmployeeNavigation";
import Cookies from 'universal-cookie';

export default function EmployeeInterface() {
    const cookies = new Cookies();
    const [signOut] = useOutletContext();

    return (
        <div id="overlay">
            <div className="clickable">
                <Navbar expand="lg" className="topnavbar">
                    <Navbar.Brand className="navbar-style" as={Link} to="/home"><b>INERTIA</b></Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text className="navbar-pad-right text-white">
                            Logged in as: {cookies.get("accountName")}
                        </Navbar.Text>
                        <Nav.Item className="navbar-pad-right">
                            <DropdownButton align="end" className="float-right" variant="dark"
                                            title={<span><i><FontAwesomeIcon icon={faUser}/></i></span>}>
                                <Dropdown.Item as={Link} to="/" onClick={signOut}>Sign Out</Dropdown.Item>
                            </DropdownButton>
                        </Nav.Item>
                    </Navbar.Collapse>
                </Navbar>
                <Row className="manager-rows">
                    <Col xs="auto" className="staff-nav-column solid-border border-dark">
                        <EmployeeNavigation/>
                        <EmployeeMobileNavigation/>
                    </Col>
                    <Col xs={11} md={11} lg={9}>
                        <Outlet context={[signOut]}/>
                    </Col>
                </Row>
            </div>
        </div>
    );
};