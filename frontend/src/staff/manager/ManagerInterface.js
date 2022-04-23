import React from "react";
import {Nav, Row, Col, Navbar, DropdownButton, Dropdown} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {MdDashboard, MdElectricScooter, MdSettings, MdCreate, MdManageAccounts} from "react-icons/md"
import {FaExclamation} from "react-icons/fa";
import {IoIosStats} from "react-icons/io"
import {RiBuilding3Fill} from "react-icons/ri";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import Cookies from 'universal-cookie';
import {Link, Outlet, useOutletContext} from "react-router-dom";
import ManagerMobileNavigation from "./ManagerMobileNavigation"
import ManagerNavigation from "./ManagerNavigation"

export default function ManagerInterface() {
    const cookies = new Cookies();
    const [signOut] = useOutletContext();

    return (
        <div id="overlay">
            <div id="manager-wrapper" className="clickable">
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
                    <Col xs={"auto"} className="staff-nav-column border-end border-dark">
                        <ManagerMobileNavigation/>
                        <ManagerNavigation/>
                    </Col>
                    <Col xs={9}>
                        <Outlet context={[signOut]}/>
                    </Col>
                </Row>
            </div>
        </div>
    );
};