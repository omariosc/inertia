import React, {useState} from "react";
import {Row, Col, Nav} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css"
import AccountInformation from "./CustomerAccountInformation";
import CreateBooking from "./CustomerCreateBooking";
import CurrentBookings from "./CustomerCurrentBooking";
import BookingHistory from "./CustomerBookingHistory";
import CustomerSettings from './CustomerSettings';
import SubmitIssue from "./CustomerSubmitIssues";

function CustomerInterface() {
    const [showAccountInformation, setShowAccountInformation] = useState(true);
    const [showCreateBooking, setShowCreateBooking] = useState(false);
    const [showCurrentBookings, setShowCurrentBookings] = useState(false);
    const [showBookingHistory, setShowBookingHistory] = useState(false);
    const [showSubmitIssue, setShowSubmitIssue] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    return (
        <div id="account-page">
            <Row>
                <Col xs={4} className="d-flex justify-content-end border-end border-dark">
                    <h1>INERTIA</h1>
                </Col>
                <Col>
                    <>
                        {showAccountInformation ? <h4>Account Information</h4> : null}
                        {showCreateBooking ? <h4>Create Booking</h4> : null}
                        {showCurrentBookings ? <h4>Current Bookings</h4> : null}
                        {showBookingHistory ? <h4>Booking History</h4> : null}
                        {showSubmitIssue ? <h4>Submit Issue</h4> : null}
                        {showSettings ? <h4>Settings</h4> : null}
                    </>
                </Col>
            </Row>
            <Row>
                <Col xs={4} className="border-end border-dark">
                    <Nav defaultActiveKey="#/account" className="align-items-end flex-column">
                        <Nav.Link href="#/account"
                                  onClick={() => {
                                      setShowAccountInformation(true);
                                      setShowCreateBooking(false);
                                      setShowCurrentBookings(false);
                                      setShowBookingHistory(false);
                                      setShowSubmitIssue(false);
                                      setShowSettings(false);
                                  }}>Account Information</Nav.Link>
                        <Nav.Link href="#/create-bookings"
                                  onClick={() => {
                                      setShowAccountInformation(false);
                                      setShowCreateBooking(true);
                                      setShowCurrentBookings(false);
                                      setShowBookingHistory(false);
                                      setShowSubmitIssue(false);
                                      setShowSettings(false);
                                  }}>Create Bookings</Nav.Link>
                        <Nav.Link href="#/current-bookings"
                                  onClick={() => {
                                      setShowAccountInformation(false);
                                      setShowCreateBooking(false);
                                      setShowCurrentBookings(true);
                                      setShowBookingHistory(false);
                                      setShowSubmitIssue(false);
                                      setShowSettings(false);
                                  }}>Current Booking</Nav.Link>
                        <Nav.Link href="#/booking-history"
                                  onClick={() => {
                                      setShowAccountInformation(false);
                                      setShowCreateBooking(false);
                                      setShowCurrentBookings(false);
                                      setShowBookingHistory(true);
                                      setShowSubmitIssue(false);
                                      setShowSettings(false);
                                  }}>Booking History</Nav.Link>
                        <Nav.Link href="#/submit-issue"
                                  onClick={() => {
                                      setShowAccountInformation(false);
                                      setShowCreateBooking(false);
                                      setShowCurrentBookings(false);
                                      setShowBookingHistory(false);
                                      setShowSubmitIssue(true);
                                      setShowSettings(false);
                                  }}>Submit Issue</Nav.Link>
                        <Nav.Link href="#/settings"
                                  onClick={() => {
                                      setShowAccountInformation(false);
                                      setShowCreateBooking(false);
                                      setShowCurrentBookings(false);
                                      setShowBookingHistory(false);
                                      setShowSubmitIssue(false);
                                      setShowSettings(true);
                                  }}>Settings</Nav.Link>
                    </Nav>
                </Col>
                <Col>
                    <>
                        {showAccountInformation ?
                            <AccountInformation onHide={() => setShowAccountInformation(false)}/> : null}
                        {showCreateBooking ? <CreateBooking onHide={() => setShowCreateBooking(false)}/> : null}
                        {showCurrentBookings ? <CurrentBookings onHide={() => setShowCurrentBookings(false)}/> : null}
                        {showBookingHistory ? <BookingHistory onHide={() => setShowBookingHistory(false)}/> : null}
                        {showSubmitIssue ? <SubmitIssue onHide={() => setShowBookingHistory(false)}/> : null}
                        {showSettings ?
                            <CustomerSettings interface="customer" onHide={() => setShowSettings(false)}/> : null}
                    </>
                </Col>
            </Row>
        </div>
    );
}

export default CustomerInterface;
