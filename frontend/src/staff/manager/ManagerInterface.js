import React from "react";
import {Link, Outlet, useOutletContext} from "react-router-dom";
import {Nav, Row, Col, Navbar, DropdownButton, Dropdown} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import ManagerMobileNavigation from "./ManagerMobileNavigation"
import ManagerNavigation from "./ManagerNavigation"
import Cookies from 'universal-cookie';

export default function ManagerInterface() {
    const cookies = new Cookies();
    const [signOut] = useOutletContext();

    return (
        <div id="overlay">
            <div id="manager-wrapper" className="clickable">
                <Navbar expand="lg" className="clickable black-bg">
                    <Navbar.Brand className="navbar-style" as={Link} to="/dashboard"><b>INERTIA</b></Navbar.Brand>
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
                <Row id="manager-row">
                    <Col xs="auto" className="staff-nav-column solid-border border-dark">
                        <ManagerNavigation/>
                        <ManagerMobileNavigation/>
                    </Col>
                    <Col xs={9}>
                        <Outlet context={[signOut]}/>
                        <br/>
                        <br/>
                    </Col>
                </Row>
            </div>
        </div>
    );
};