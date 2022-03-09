import React, {useState} from "react";
import {Container, Navbar, Nav, Dropdown, DropdownButton, NavItem, Row, Col} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from './ManagerDashboard.js'
import ScooterManagement from './ManagerScooterManagement.js'
import Issues from './ManagerIssues.js'
import Statistics from './ManagerStatistics.js'
import AccountManagement from './ManagerAccountManagement.js'
import Settings from './ManagerSettings.js'
import './App.css';

const App = (props) => {
    const [showDashboard, setShowDashboard] = useState(true);
    const [showScooter, setShowScooter] = useState(false);
    const [showIssues, setShowIssues] = useState(false);
    const [showStatistics, setShowStatistics] = useState(false);
    const [showAccounts, setShowAccounts] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    return (
        <div id="wrapper">
            <Navbar expand="lg" bg="dark" variant="dark">
                <Navbar.Brand className="navbar-pad-left">
                    <img
                        src="favicon.ico"
                        width="30"
                        height="30"
                        alt=""
                    />
                    INERTIA
                </Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text className="navbar-pad-right">
                        Signed in as: <a href="#settings">Manager Admin</a>
                    </Navbar.Text>
                    <Nav.Item className="navbar-pad-right">
                        <DropdownButton
                            align="end"
                            id="dropdown-basic-button"
                            title={<span><i><FontAwesomeIcon icon={faUser}/></i></span>}
                            variant="secondary" menuVariant="dark"
                        >
                            <Dropdown.Item href="#signout"><p>Sign Out</p></Dropdown.Item>
                        </DropdownButton>
                    </Nav.Item>
                </Navbar.Collapse>
            </Navbar>
            <Row>
                <Col xs={2}>
                    <Nav
                        defaultActiveKey="#dashboard"
                        variant="pills"
                        className="flex-column vertical-navbar"
                    >
                        <Nav.Link onClick={() => {
                            setShowDashboard(true);
                            setShowScooter(false);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(false)
                        }}
                            href="#dashboard">Dashboard</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(true);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(false)
                        }}
                            href="#scooters">Scooter Management</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowIssues(true);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(false)
                        }}
                            href="#issues">Issues</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowIssues(false);
                            setShowStatistics(true);
                            setShowAccounts(false);
                            setShowSettings(false)
                        }}
                            href="#statistics">Statistics</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(true);
                            setShowSettings(false)
                        }}
                            href="#accounts">Account Management</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooter(false);
                            setShowIssues(false);
                            setShowStatistics(false);
                            setShowAccounts(false);
                            setShowSettings(true)
                        }}
                            href="#settings">Settings</Nav.Link>
                    </Nav>
                </Col>
                <Col xs={9}>
                    <>
                        {showDashboard ? <Dashboard onHide={() => setShowDashboard(false)}/> : null}
                        {showScooter ? <ScooterManagement onHide={() => setShowScooter(false)}/> : null}
                        {showIssues ? <Issues onHide={() => setShowIssues(false)}/> : null}
                        {showStatistics ? <Statistics onHide={() => setShowStatistics(false)}/> : null}
                        {showAccounts ? <AccountManagement onHide={() => setShowAccounts(false)}/> : null}
                        {showSettings ? <Settings onHide={() => setShowSettings(false)}/> : null}
                    </>
                </Col>
            </Row>
        </div>
    )
};


export default App;