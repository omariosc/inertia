import React from "react";
import {Link, Outlet} from "react-router-dom";
import {Nav, Row, Col, Navbar} from "react-bootstrap";
import UserMenu from '../../components/UserMenu';
import ManagerMobileNavigation from "./ManagerMobileNavigation";
import ManagerNavigation from "./ManagerNavigation";
import {useAccount} from "../../authorize";

export default function ManagerInterface() {
    const [account] = useAccount();

    return (
        <div id="overlay">
            <div id="manager-wrapper" className="clickable">
                <Navbar expand="lg" className="topnavbar">
                    <Navbar.Brand className="navbar-style" as={Link} to="/dashboard"><b>INERTIA</b></Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text className="navbar-pad-right text-white">
                            Logged in as: {account.name}
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
                    <Col xs={11} lg={8} xl={9}>
                        <Outlet/>
                        <br/>
                        <br/>
                    </Col>
                </Row>
            </div>
        </div>
    );
};