import React from "react";
import {Link, Outlet, useOutletContext} from "react-router-dom";
import {Nav, Row, Col, Navbar} from "react-bootstrap";
import UserMenu from '../../components/UserMenu';
import ManagerMobileNavigation from "./ManagerMobileNavigation"
import ManagerNavigation from "./ManagerNavigation"
import Cookies from 'universal-cookie';

export default function ManagerInterface() {
    const cookies = new Cookies();
    const [signOut] = useOutletContext();

    return (
        <div id="overlay">
            <div id="manager-wrapper" className="clickable">
                <Navbar expand="lg" className="topnavbar">
                    <Navbar.Brand className="navbar-style" as={Link} to="/dashboard"><b>INERTIA</b></Navbar.Brand>
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
                        <ManagerNavigation/>
                        <ManagerMobileNavigation/>
                    </Col>
                    <Col xs={11}>
                        <Outlet context={[signOut]}/>
                        <br/>
                        <br/>
                    </Col>
                </Row>
            </div>
        </div>
    );
};