import React, {useState} from "react";
import {Col, Nav, Row} from "react-bootstrap";
import {MdDashboard, MdElectricScooter, MdSettings, MdHistory, MdCreate, MdBook} from "react-icons/md"
import {FaExclamation, FaPercentage} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from '../StaffDashboard';
import CreateBooking from './EmployeeCreateBooking';
import BookingApplications from './EmployeeBookingApplications';
import OngoingBookings from './EmployeeOngoingBookings';
import BookingHistory from './EmployeeBookingHistory';
import ScooterManagement from './EmployeeScooterManagement';
import SubmitIssue from './EmployeeSubmitIssues';
import ManageIssues from './EmployeeManageIssues';
import DiscountApplication from './EmployeeDiscountApplications';
import StaffSettings from '../StaffSettings';
import '../StaffInterface.css';

export default function EmployeeInterface({isDark, toggle, map_locations}) {
    const [showDashboard, setShowDashboard] = useState(true);
    const [showCreateBooking, setShowCreateBooking] = useState(false);
    const [showBookingApplications, setShowBookingApplications] = useState(false);
    const [showOngoingBookings, setShowOngoingBookings] = useState(false);
    const [showBookingHistory, setShowBookingHistory] = useState(false);
    const [showManageDiscountApplications, setShowManageDiscountApplications] = useState(false);
    const [showScooterManagement, setShowScooterManagement] = useState(false);
    const [showSubmitIssue, setShowSubmitIssue] = useState(false);
    const [showManageIssues, setShowManageIssues] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="clickable">
            <Row id={"manager-row"}>
                <Col xs={"auto"} style={{backgroundColor: "#F0F0F0"}} className="border-end border-dark">
                    <Nav
                        defaultActiveKey="#/employee-dashboard"
                        variant="pills"
                        className="manager-vert-navbar flex-column"
                        style={{paddingLeft: "15px"}}
                    >
                        <Nav.Link onClick={() => {
                            setShowDashboard(true);
                            setShowCreateBooking(false);
                            setShowBookingApplications(false);
                            setShowOngoingBookings(false);
                            setShowBookingHistory(false);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/employee-dashboard"><MdDashboard/> Dashboard</Nav.Link>
                        <Nav.Link><MdBook/> Bookings</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(true);
                            setShowBookingApplications(false);
                            setShowOngoingBookings(false);
                            setShowBookingHistory(false);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/employee-create-booking" className={"nav-indented"}>Create Booking</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingApplications(true);
                            setShowOngoingBookings(false);
                            setShowBookingHistory(false);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/employee-booking-applications" className={"nav-indented"}>Booking Applications</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingApplications(false);
                            setShowOngoingBookings(true);
                            setShowBookingHistory(false);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/employee-ongoing-bookings" className={"nav-indented"}>Ongoing Bookings</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingApplications(false);
                            setShowOngoingBookings(false);
                            setShowBookingHistory(true);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/employee-booking-history" className={"nav-indented"}>Booking History</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingApplications(false);
                            setShowOngoingBookings(false);
                            setShowBookingHistory(false);
                            setShowScooterManagement(true);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/employee-scooter-management"><MdElectricScooter/> Scooter Management</Nav.Link>
                        <Nav.Link><FaExclamation/> Issues</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingApplications(false);
                            setShowOngoingBookings(false);
                            setShowBookingHistory(false);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(true);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/employee-submit-issues" className={"nav-indented"}> Submit Issue</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingApplications(false);
                            setShowOngoingBookings(false);
                            setShowBookingHistory(false);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(false);
                            setShowManageIssues(true);
                            setShowSettings(false)
                        }}
                                  href="#/employee-manage-issues" className={"nav-indented"}>Manage Issues</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingApplications(false);
                            setShowBookingHistory(false);
                            setShowOngoingBookings(false);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(true);
                            setShowSubmitIssue(false);
                            setShowManageIssues(false);
                            setShowSettings(false)
                        }}
                                  href="#/employee-discount-applications"><FaPercentage/> Discount Applications</Nav.Link>
                        <Nav.Link onClick={() => {
                            setShowDashboard(false);
                            setShowCreateBooking(false);
                            setShowBookingApplications(false);
                            setShowOngoingBookings(false);
                            setShowBookingHistory(false);
                            setShowScooterManagement(false);
                            setShowManageDiscountApplications(false);
                            setShowSubmitIssue(false);
                            setShowManageIssues(false);
                            setShowSettings(true)
                        }}
                                  href="#/employee-settings"><MdSettings/> Settings</Nav.Link>
                    </Nav>
                </Col>
                <Col xs={9}>
                    <>
                        {showDashboard ? <Dashboard onHide={() => setShowDashboard(false)}/> : null}
                        {showCreateBooking ? <CreateBooking map_locations={map_locations}
                                                            onHide={() => setShowCreateBooking(false)}/> : null}
                        {showBookingApplications ?
                            <BookingApplications onHide={() => setShowBookingApplications(false)}/> : null}
                        {showOngoingBookings ? <OngoingBookings onHide={() => setShowOngoingBookings(false)}/> : null}
                        {showBookingHistory ? <BookingHistory onHide={() => setShowBookingHistory(false)}/> : null}
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