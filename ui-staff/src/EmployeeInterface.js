import React, {useState} from "react";
import {Nav, Row, Col} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from './EmployeeDashboard.js';
import ScooterManagement from './EmployeeScooterManagement.js';
import SubmitIssues from './EmployeeSubmitIssues.js';
import ManageIssues from './EmployeeManageIssues.js';
import Settings from './StaffSettings.js';
import './StaffInterface.css';

function EmployeeInterface() {
    const [showDashboard, setShowDashboard] = useState(true);
    const [showScooterManagement, setShowScooterManagement] = useState(false);
    const [showSubmitIssues, setShowSubmitIssues] = useState(false);
    const [showManageIssues, setShowManageIssues] = useState(false);
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
                            setShowSubmitIssues(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/dashboard">Dashboard</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooterManagement(true);
                            setShowSubmitIssues(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/scooter-management">Scooter Management</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooterManagement(false);
                            setShowSubmitIssues(true);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/submit-issues">Submit Issues</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooterManagement(false);
                            setShowSubmitIssues(false);
                            setShowManageIssues(true);
                            setShowSettings(false)
                        }}
                                  href="#/manage-issues">Manage Issues</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowScooterManagement(false);
                            setShowSubmitIssues(false);
                            setShowManageIssues(false);
                            setShowSettings(true)
                        }}
                                  href="#/settings">Settings</Nav.Link>
                    </Nav>
                </Col>
                <Col xs={9}>
                    <>
                        {showDashboard ? <Dashboard onHide={() => setShowDashboard(false)}/> : null}
                        {showScooterManagement ? <ScooterManagement onHide={() => setShowScooterManagement(false)}/> : null}
                        {showSubmitIssues ? <SubmitIssues onHide={() => setShowSubmitIssues(false)}/> : null}
                        {showManageIssues ? <ManageIssues onHide={() => setShowManageIssues(false)}/> : null}
                        {showSettings ? <Settings onHide={() => setShowSettings(false)}/> : null}
                    </>
                </Col>
            </Row>
        </div>
    );
}

export default EmployeeInterface;