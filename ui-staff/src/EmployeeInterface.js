import React, {useState} from "react";
import {Nav, Row, Col} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from './EmployeeDashboard.js';
import ScooterManagement from './EmployeeScooterManagement.js';
import Settings from './StaffSettings.js';
import './StaffInterface.css';

function EmployeeInterface() {
    const [showDashboard, setShowDashboard] = useState(true);
    const [showScooterManagement, setShowScooterManagement] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    return (
        <div id="wrapper">
            <Row>
                <Col xs={2}>
                    <Nav
                        defaultActiveKey="#dashboard"
                        variant="pills"
                        className="flex-column vertical-navbar"
                    >
                        <Nav.Link onClick={() => {
                            setShowDashboard(true);
                            setShowScooterManagement(false);
                            setShowSettings(false)
                        }}
                                  href="#/dashboard">Dashboard</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooterManagement(true);
                            setShowSettings(false)
                        }}
                                  href="#/scooter-management">Scooter Management</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooterManagement(false);
                            setShowSettings(true)
                        }}
                                  href="#/settings">Settings</Nav.Link>
                    </Nav>
                </Col>
                <Col xs={9}>
                    <>
                        {showDashboard ? <Dashboard onHide={() => setShowDashboard(false)}/> : null}
                        {showScooterManagement ? <ScooterManagement onHide={() => setShowScooterManagement(false)}/> : null}
                        {showSettings ? <Settings onHide={() => setShowSettings(false)}/> : null}
                    </>
                </Col>
            </Row>
        </div>
    )
};

export default EmployeeInterface;