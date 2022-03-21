import React, {useState} from "react";
import {Nav, Row, Col} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from './EmployeeDashboard.js';
import CreateBooking from './EmployeeCreateBooking.js';
import BookingHistory from './EmployeeBookingHistory.js';
import CurrentBookings from './EmployeeCurrentBookings.js';
import ScooterManagement from './EmployeeScooterManagement.js';
import SubmitIssues from './EmployeeSubmitIssues.js';
import ManageIssues from './EmployeeManageIssues.js';
import ManageApplication from './EmployeeManageApplications.js'
import Settings from './StaffSettings.js';
import './StaffInterface.css';

function EmployeeInterface() {
    const [showDashboard, setShowDashboard] = useState(true);
    const [showCreateBooking, setShowCreateBooking] = useState(false);
    const [showBookingHistory, setShowBookingHistory] = useState(false);
    const [showCurrentBookings, setShowCurrentBookings] = useState(false);
    const [showManageApplication, setShowManageApplication] = useState(false);
    const [showScooterManagement, setShowScooterManagement] = useState(false);
    const [showSubmitIssues, setShowSubmitIssues] = useState(false);
    const [showManageIssues, setShowManageIssues] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    return (
        <div className="clickable">
            <Row>
                <Col xs={2}>
                    <Nav
                        defaultActiveKey="#/dashboard"
                        variant="pills"
                        className="flex-column vertical-navbar"
                        style={{paddingLeft: "15px"}}
                    >
                        <Nav.Link onClick={() => {
                            setShowDashboard(true);
                            setShowCreateBooking(false);
                            setShowBookingHistory(false);
                            setShowCurrentBookings(false);
                            setShowScooterManagement(false);
                            setShowManageApplication(false);
                            setShowSubmitIssues(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/dashboard">Dashboard</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(true);
                            setShowBookingHistory(false);
                            setShowCurrentBookings(false);
                            setShowScooterManagement(false);
                            setShowManageApplication(false);
                            setShowSubmitIssues(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/create-booking">Create Booking</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingHistory(false);
                            setShowCurrentBookings(true);
                            setShowScooterManagement(false);
                            setShowManageApplication(false);
                            setShowSubmitIssues(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/current-bookings">Current Bookings</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingHistory(true);
                            setShowCurrentBookings(false);
                            setShowScooterManagement(false);
                            setShowManageApplication(false);
                            setShowSubmitIssues(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/booking-history">Booking History</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingHistory(false);
                            setShowCurrentBookings(false);
                            setShowScooterManagement(true);
                            setShowManageApplication(false);
                            setShowSubmitIssues(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/scooter-management">Scooter Management</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingHistory(false);
                            setShowCurrentBookings(false);
                            setShowScooterManagement(false);
                            setShowManageApplication(false);
                            setShowSubmitIssues(true);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/submit-issues">Submit Issues</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingHistory(false);
                            setShowCurrentBookings(false);
                            setShowScooterManagement(false);
                            setShowManageApplication(false);
                            setShowSubmitIssues(false);
                            setShowManageIssues(true);
                            setShowSettings(false)
                        }}
                                  href="#/manage-issues">Manage Issues</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingHistory(false);
                            setShowCurrentBookings(false);
                            setShowScooterManagement(false);
                            setShowManageApplication(true);
                            setShowSubmitIssues(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/manage-applications">Manage Applications</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingHistory(false);
                            setShowCurrentBookings(false);
                            setShowScooterManagement(false);
                            setShowManageApplication(false);
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
                        {showCreateBooking ? <CreateBooking onHide={() => setShowCreateBooking(false)}/> : null}
                        {showBookingHistory ? <BookingHistory onHide={() => setShowBookingHistory(false)}/> : null}
                        {showCurrentBookings ? <CurrentBookings onHide={() => setShowCurrentBookings(false)}/> : null}
                        {showScooterManagement ?
                            <ScooterManagement onHide={() => setShowScooterManagement(false)}/> : null}
                        {showSubmitIssues ? <SubmitIssues onHide={() => setShowSubmitIssues(false)}/> : null}
                        {showManageIssues ? <ManageIssues onHide={() => setShowManageIssues(false)}/> : null}
                        {showManageApplication ?
                            <ManageApplication onHide={() => setShowManageApplication(false)}/> : null}
                        {showSettings ? <Settings onHide={() => setShowSettings(false)}/> : null}
                    </>
                </Col>
            </Row>
        </div>
    );
}

export default EmployeeInterface;