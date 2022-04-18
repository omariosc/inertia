import React, {useState} from "react";
import {Nav, Row, Col} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from './StaffDashboard.js';
import ScooterManagement from './ManagerScooterManagement.js';
import HireOptionManagement from "./ManagerHireOptionManagement";
import DepotManagement from "./ManagerDepotManagement";
import Issues from './ManagerIssues.js';
import Statistics from './ManagerStatistics.js';
import AccountManagement from './ManagerAccountManagement.js';
import StaffSettings from './StaffSettings.js';
import './StaffInterface.css';

export default function ManagerInterface({isDark, toggle, map_locations}) {
    const [showDashboard, setShowDashboard] = useState(true);
    const [showScooter, setShowScooter] = useState(false);
    const [showHireOption, setShowHireOption] = useState(false);
    const [showDepot, setShowDepot] = useState(false);
    const [showIssues, setShowIssues] = useState(false);
    const [showStatistics, setShowStatistics] = useState(false);
    const [showAccounts, setShowAccounts] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div id="manager-wrapper" className="clickable">
            <Row id={"manager-row"}>
                <Col xs={2} style={{backgroundColor: "#F0F0F0"}}className="border-end border-dark">
                    <Nav
                        defaultActiveKey="#/dashboard"
                        variant="pills"
                        className="manager-vert-navbar"
                        style={{paddingLeft: "15px", color: "black"}}
                    >
                        <Nav.Link onClick={() => {
                            setShowDashboard(true);
                            setShowScooter(false);
                            setShowHireOption(false);
                            setShowDepot(false);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(false);
                        }}
                                  href="#/manager-dashboard">Dashboard</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(true);
                            setShowHireOption(false);
                            setShowDepot(false);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(false);
                        }}
                                  href="#/manager-scooters">Scooter Management</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowHireOption(true);
                            setShowDepot(false);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(false);
                        }}
                                  href="#/manager-hire-options">Hire Option Management</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowHireOption(false);
                            setShowDepot(true);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(false);
                        }}
                                  href="#/manager-depot">Depot Management</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowHireOption(false);
                            setShowDepot(false);
                            setShowIssues(true);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(false);
                        }}
                                  href="#/manager-issues">Issues</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowHireOption(false);
                            setShowDepot(false);
                            setShowIssues(false);
                            setShowStatistics(true);
                            setShowAccounts(false);
                            setShowSettings(false);
                        }}
                                  href="#/manager-statistics">Statistics</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowHireOption(false);
                            setShowDepot(false);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(true);
                            setShowSettings(false);
                        }}
                                  href="#/manager-accounts">Account Management</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowHireOption(false);
                            setShowDepot(false);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(true);
                        }}
                                  href="#/manager-settings">Settings</Nav.Link>
                    </Nav>
                </Col>
                <Col xs={9}>
                    <>
                        {showDashboard ? <Dashboard onHide={() => setShowDashboard(false)}/> : null}
                        {showScooter ? <ScooterManagement map_locations={map_locations} onHide={() => setShowScooter(false)}/> : null}
                        {showHireOption ? <HireOptionManagement onHide={() => setShowHireOption(false)}/> : null}
                        {showDepot ? <DepotManagement map_locations={map_locations} onHide={() => setShowDepot(false)}/> : null}
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