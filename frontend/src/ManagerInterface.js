import React, {useState} from "react";
import {Nav,  Row, Col} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from './StaffDashboard.js';
import ScooterManagement from './ManagerScooterManagement.js';
import Issues from './ManagerIssues.js';
import Statistics from './ManagerStatistics.js';
import AccountManagement from './ManagerAccountManagement.js';
import StaffSettings from './StaffSettings.js';
import './StaffInterface.css';

import {NavMenu} from "./navbar";

export default function ManagerInterface({isDark, toggle, map_locations}) {
    const [expanded, setExpanded] = useState(false);
    const [showDashboard, setShowDashboard] = useState(true);
    const [showScooter, setShowScooter] = useState(false);
    const [showIssues, setShowIssues] = useState(false);
    const [showStatistics, setShowStatistics] = useState(false);
    const [showAccounts, setShowAccounts] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="clickable">
            <Row>
                <Col xs={2} className="border-end border-dark">
                    <Nav
                        defaultActiveKey="#/dashboard"
                        variant="pills"
                        className="flex-column"
                        style={{paddingLeft: "15px", color: "black"}}
                    >
                        <NavMenu
                            className="flex-column"
                            style={{paddingLeft: "15px", color: "black"}}
                        >

                        <Nav.Link onClick={() => {
                            setShowDashboard(true);
                            setShowScooter(false);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(false);
                        }}
                                  href="#/dashboard">Dashboard</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(true);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(false);
                        }}
                                  href="#/scooters">Scooter Management</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowIssues(true);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(false);
                        }}
                                  href="#/issues">Issues</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowIssues(false);
                            setShowStatistics(true);
                            setShowAccounts(false);
                            setShowSettings(false);
                        }}
                                  href="#/statistics">Statistics</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(true);
                            setShowSettings(false);
                        }}
                                  href="#/accounts">Account Management</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(true);
                        }}
                                  href="#/settings">Settings</Nav.Link>

                        </NavMenu>
                    </Nav>
                </Col>
                <Col xs={9}>
                    <>
                        {showDashboard ? <Dashboard onHide={() => setShowDashboard(false)}/> : null}
                        {showScooter ? <ScooterManagement map_locations={map_locations} onHide={() => setShowScooter(false)}/> : null}
                        {showIssues ? <Issues onHide={() => setShowIssues(false)}/> : null}
                        {showStatistics ? <Statistics isDark={isDark} onHide={() => setShowStatistics(false)}/> : null}
                        {showAccounts ? <AccountManagement onHide={() => setShowAccounts(false)}/> : null}
                        {showSettings ? <StaffSettings isDark={isDark} toggle={toggle}
                                                       onHide={() => setShowSettings(false)}/> : null}
                    </>
                </Col>
            </Row>
        </div>
    );
};