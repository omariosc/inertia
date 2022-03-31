import React, {useState} from "react";
import {Col, Nav, NavDropdown, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from './StaffDashboard';
import ScooterManagement from './ManagerScooterManagement';
import Issues from './ManagerIssues';
import Statistics from './ManagerStatistics';
import AccountManagement from './ManagerAccountManagement';
import StaffSettings from './StaffSettings';
import useMediaQuery from "./useMediaQuery";
import './StaffInterface.css';

export default function ManagerInterface({isDark, toggle, map_locations}) {
    const isMobile = useMediaQuery('(min-width: 768px)', {noSsr: true});
    const [showDashboard, setShowDashboard] = useState(true);
    const [showScooter, setShowScooter] = useState(false);
    const [showDepo, setShowDepot] = useState(false);
    const [showHireOptions, setShowHireOptions] = useState(false);
    const [showIssues, setShowIssues] = useState(false);
    const [showStatistics, setShowStatistics] = useState(false);
    const [showAccounts, setShowAccounts] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="clickable">
            <Row>
                <Col xs={2} className="border-end border-dark">
                    <Nav
                        defaultActiveKey="#/manager-dashboard"
                        variant="pills"
                        className="flex-column"
                        style={{paddingLeft: "15px", color: "black"}}
                    >
                        <Nav.Link onClick={() => {
                            setShowDashboard(true);
                            setShowScooter(false);
                            setShowDepot(false);
                            setShowHireOptions(false);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(false);
                        }}
                                  href="#/manager-dashboard">Dashboard</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(true);
                            setShowDepot(false);
                            setShowHireOptions(false);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(false);
                        }}
                                  href="#/manager-scooter-management">Scooter Management</Nav.Link>
                        {/*<Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowDepot(true);
                            setShowHireOptions(false);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(false);
                        }}
                                  href="#/manager-depot-management">Depot Management</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowDepot(false);
                            setShowHireOptions(true);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(false);
                        }}
                                  href="#/manager-hire-options-management">Hire Option Management</Nav.Link>*/}
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowDepot(false);
                            setShowHireOptions(false);
                            setShowIssues(true);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(false);
                        }}
                                  href="#/manager-issues">High Priority Issues</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowDepot(false);
                            setShowHireOptions(false);
                            setShowIssues(false);
                            setShowStatistics(true);
                            setShowAccounts(false);
                            setShowSettings(false);
                        }}
                                  href="#/manager-statistics">Statistics</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowDepot(false);
                            setShowHireOptions(false);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(true);
                            setShowSettings(false);
                        }}
                                  href="#/manager-account-management">Create Employee Account</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowDepot(false);
                            setShowHireOptions(false);
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
                        {showScooter ? <ScooterManagement map_locations={map_locations}
                                                          onHide={() => setShowScooter(false)}/> : null}
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

    return (
        <div className="clickable">
            {isMobile ?
                <Row>
                    <Col xs={2} className="border-end border-dark">
                        <Nav
                            defaultActiveKey="#/dashboard"
                            variant="pills"
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
                        </Nav>
                    </Col>
                    <Col xs={9}>
                        <>
                            {showDashboard ? <Dashboard onHide={() => setShowDashboard(false)}/> : null}
                            {showScooter ? <ScooterManagement map_locations={map_locations}
                                                              onHide={() => setShowScooter(false)}/> : null}
                            {showIssues ? <Issues onHide={() => setShowIssues(false)}/> : null}
                            {showStatistics ?
                                <Statistics isDark={isDark} onHide={() => setShowStatistics(false)}/> : null}
                            {showAccounts ? <AccountManagement onHide={() => setShowAccounts(false)}/> : null}
                            {showSettings ? <StaffSettings isDark={isDark} toggle={toggle}
                                                           onHide={() => setShowSettings(false)}/> : null}
                        </>
                    </Col>
                </Row>
                :
                <div>
                    <Nav
                        defaultActiveKey="#/dashboard"
                        variant="pills"
                        className="flex-row"
                        style={{paddingLeft: "15px", color: "black"}}
                    >
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={() => {
                                setShowDashboard(true);
                                setShowScooter(false);
                                setShowIssues(false);
                                setShowStatistics(false);
                                setShowAccounts(false);
                                setShowSettings(false);
                            }}
                                              href="#/dashboard">Dashboard</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {
                                setShowDashboard(false);
                                setShowScooter(true);
                                setShowIssues(false);
                                setShowStatistics(false);
                                setShowAccounts(false);
                                setShowSettings(false);
                            }}
                                              href="#/scooters">Scooter Management</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {
                                setShowDashboard(false);
                                setShowScooter(false);
                                setShowIssues(true);
                                setShowStatistics(false);
                                setShowAccounts(false);
                                setShowSettings(false);
                            }}
                                              href="#/issues">Issues</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {
                                setShowDashboard(false);
                                setShowScooter(false);
                                setShowIssues(false);
                                setShowStatistics(true);
                                setShowAccounts(false);
                                setShowSettings(false);
                            }}
                                              href="#/statistics">Statistics</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {
                                setShowDashboard(false);
                                setShowScooter(false);
                                setShowIssues(false);
                                setShowStatistics(false);
                                setShowAccounts(true);
                                setShowSettings(false);
                            }}
                                              href="#/accounts">Account Management</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => {
                                setShowDashboard(false);
                                setShowScooter(false);
                                setShowIssues(false);
                                setShowStatistics(false);
                                setShowAccounts(false);
                                setShowSettings(true);
                            }}
                                              href="#/settings">Settings</NavDropdown.Item>
                        </NavDropdown>


                    </Nav>

                    {showDashboard ? <Dashboard onHide={() => setShowDashboard(false)}/> : null}
                    {showScooter ? <ScooterManagement map_locations={map_locations}
                                                      onHide={() => setShowScooter(false)}/> : null}
                    {showIssues ? <Issues onHide={() => setShowIssues(false)}/> : null}
                    {showStatistics ?
                        <Statistics isDark={isDark} onHide={() => setShowStatistics(false)}/> : null}
                    {showAccounts ? <AccountManagement onHide={() => setShowAccounts(false)}/> : null}
                    {showSettings ? <StaffSettings isDark={isDark} toggle={toggle}
                                                   onHide={() => setShowSettings(false)}/> : null}

                </div>}
        </div>

    );

};