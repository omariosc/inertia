import React from "react";
import {Outlet, Link} from 'react-router-dom';
import {Col, Nav, Navbar, Row} from "react-bootstrap";
import UserMenu from '../../components/UserMenu';
import EmployeeMobileNavigation from "./EmployeeMobileNavigation";
import EmployeeNavigation from "./EmployeeNavigation";
import Cookies from 'universal-cookie';

export default function EmployeeInterface() {
    const cookies = new Cookies();

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
                            <UserMenu/>
                        </Nav.Item>
                    </Navbar.Collapse>
                </Navbar>
                <Row className="manager-rows">
                    <Col xs="auto" className="staff-nav-column solid-border border-dark">
                        <EmployeeNavigation/>
                        <EmployeeMobileNavigation/>
                    </Col>
                    <Col xs={11}>
                        <Outlet/>
                    </Col>
                </Row>
            </div>
        </div>
    );
};