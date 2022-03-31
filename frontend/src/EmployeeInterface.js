import React, {useState} from "react";
import {Col, Nav, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from './StaffDashboard';
import CreateBooking from './EmployeeCreateBooking';
import BookingHistory from './EmployeeBookingHistory';
import OngoingBookings from './EmployeeOngoingBookings';
import ScooterManagement from './EmployeeScooterManagement';
import SubmitIssue from './EmployeeSubmitIssues';
import ManageIssues from './EmployeeManageIssues';
import DiscountApplication from './EmployeeDiscountApplications';
import StaffSettings from './StaffSettings';
import './StaffInterface.css';

export default function EmployeeInterface({isDark, toggle, map_locations}) {
    const [showDashboard, setShowDashboard] = useState(true);
    const [showCreateBooking, setShowCreateBooking] = useState(false);
    const [showBookingHistory, setShowBookingHistory] = useState(false);
    const [showOngoingBookings, setShowOngoingBookings] = useState(false);
    const [showManageDiscountApplications, setShowManageDiscountApplications] = useState(false);
    const [showScooterManagement, setShowScooterManagement] = useState(false);
    const [showSubmitIssue, setShowSubmitIssue] = useState(false);
    const [showManageIssues, setShowManageIssues] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="clickable">
            <Row>
                <Col xs={2} className="border-end border-dark">
                    <Nav
                        defaultActiveKey="#/employee-dashboard"
                        variant="pills"
                        className="flex-column"
                        style={{paddingLeft: "15px"}}
                    >
                        <Nav.Link onClick={() => {
                            setShowDashboard(true);
                            setShowCreateBooking(false);
                            setShowBookingHistory(false);
                            setShowOngoingBookings(false);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/employee-dashboard">Dashboard</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(true);
                            setShowBookingHistory(false);
                            setShowOngoingBookings(false);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/employee-create-booking">Create Booking</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingHistory(false);
                            setShowOngoingBookings(false);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/employee-booking-applications">Booking Applications</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingHistory(false);
                            setShowOngoingBookings(true);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/employee-ongoing-bookings">Ongoing Bookings</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingHistory(true);
                            setShowOngoingBookings(false);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/employee-booking-history">Booking History</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingHistory(false);
                            setShowOngoingBookings(false);
                            setShowScooterManagement(true);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/employee-scooter-management">Scooter Management</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingHistory(false);
                            setShowOngoingBookings(false);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(true);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/employee-submit-issues">Submit Issue</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingHistory(false);
                            setShowOngoingBookings(false);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(false);
                            setShowManageIssues(true);
                            setShowSettings(false)
                        }}
                                  href="#/employee-manage-issues">Manage Issues</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingHistory(false);
                            setShowOngoingBookings(false);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(true);
                            setShowSubmitIssue(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/employee-discount-applications">Discount Applications</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingHistory(false);
                            setShowOngoingBookings(false);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(false);
                            setShowManageIssues(false);
                            setShowSettings(true)
                        }}
                                  href="#/employee-settings">Settings</Nav.Link>
                    </Nav>
                </Col>
                <Col xs={9}>
                    <>
                        {showDashboard ? <Dashboard onHide={() => setShowDashboard(false)}/> : null}
                        {showCreateBooking ? <CreateBooking map_locations={map_locations}
                                                            onHide={() => setShowCreateBooking(false)}/> : null}
                        {showBookingHistory ? <BookingHistory onHide={() => setShowBookingHistory(false)}/> : null}
                        {showOngoingBookings ? <OngoingBookings onHide={() => setShowOngoingBookings(false)}/> : null}
                        {showScooterManagement ?
                            <ScooterManagement map_locations={map_locations}
                                               onHide={() => setShowScooterManagement(false)}/> : null}
                        {showSubmitIssue ? <SubmitIssue onHide={() => setShowSubmitIssue(false)}/> : null}
                        {showManageIssues ? <ManageIssues onHide={() => setShowManageIssues(false)}/> : null}
                        {showManageDiscountApplications ?
                            <DiscountApplication onHide={() => setShowManageDiscountApplications(false)}/> : null}
                        {showSettings ? <StaffSettings isDark={isDark} toggle={toggle}
                                                       onHide={() => setShowSettings(false)}/> : null}
                    </>
                </Col>
            </Row>
        </div>
    );
};