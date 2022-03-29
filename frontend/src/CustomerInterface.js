import React, {useState} from "react";
import {Row, Col, Nav} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css"
import CreateBooking from "./CustomerCreateBooking";
import OngoingBookings from "./CustomerOngoingBooking";
import BookingHistory from "./CustomerBookingHistory";
import CustomerSettings from './CustomerSettings';
import Discounts from "./CustomerDiscounts";
import SubmitIssue from "./CustomerSubmitIssue";

function CustomerInterface({isDark, toggle, map_locations}) {
    const [showCreateBooking, setShowCreateBooking] = useState(true);
    const [showCurrentBookings, setShowCurrentBookings] = useState(false);
    const [showBookingHistory, setShowBookingHistory] = useState(false);
    const [showSubmitIssue, setShowSubmitIssue] = useState(false);
    const [showDiscounts, setShowDiscounts] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    return (
        <div id="account-page">
            <Row>
                <Col xs={4} className="d-flex justify-content-end border-end border-dark">
                    <h1>INERTIA</h1>
                </Col>
                <Col>
                    <>
                        {showCreateBooking ? <h4>Create Booking</h4> : null}
                        {showCurrentBookings ? <h4>Current Bookings</h4> : null}
                        {showBookingHistory ? <h4>Booking History</h4> : null}
                        {showSubmitIssue ? <h4>Submit Issue</h4> : null}
                        {showDiscounts ? <h4>Discounts</h4> : null}
                        {showSettings ? <h4>Settings</h4> : null}
                    </>
                </Col>
            </Row>
            <Row>
                <Col xs={4} className="border-end border-dark">
                    <Nav defaultActiveKey="#/create-bookings" className="align-items-end flex-column">
                        <Nav.Link href="#/create-bookings"
                                  onClick={() => {
                                      setShowCreateBooking(true);
                                      setShowCurrentBookings(false);
                                      setShowBookingHistory(false);
                                      setShowSubmitIssue(false);
                                      setShowDiscounts(false);
                                      setShowSettings(false);
                                  }}>Create Bookings</Nav.Link>
                        <Nav.Link href="#/current-bookings"
                                  onClick={() => {
                                      setShowCreateBooking(false);
                                      setShowCurrentBookings(true);
                                      setShowBookingHistory(false);
                                      setShowSubmitIssue(false);
                                      setShowDiscounts(false);
                                      setShowSettings(false);
                                  }}>Current Booking</Nav.Link>
                        <Nav.Link href="#/booking-history"
                                  onClick={() => {
                                      setShowCreateBooking(false);
                                      setShowCurrentBookings(false);
                                      setShowBookingHistory(true);
                                      setShowSubmitIssue(false);
                                      setShowDiscounts(false);
                                      setShowSettings(false);
                                  }}>Booking History</Nav.Link>
                        <Nav.Link href="#/submit-issue"
                                  onClick={() => {
                                      setShowCreateBooking(false);
                                      setShowCurrentBookings(false);
                                      setShowBookingHistory(false);
                                      setShowSubmitIssue(true);
                                      setShowDiscounts(false);
                                      setShowSettings(false);
                                  }}>Submit Issue</Nav.Link>
                        <Nav.Link href="#/discounts"
                                  onClick={() => {
                                      setShowCreateBooking(false);
                                      setShowCurrentBookings(false);
                                      setShowBookingHistory(false);
                                      setShowSubmitIssue(false);
                                      setShowDiscounts(true);
                                      setShowSettings(false);
                                  }}>Discounts</Nav.Link>
                        <Nav.Link href="#/settings"
                                  onClick={() => {
                                      setShowCreateBooking(false);
                                      setShowCurrentBookings(false);
                                      setShowBookingHistory(false);
                                      setShowSubmitIssue(false);
                                      setShowDiscounts(false);
                                      setShowSettings(true);
                                  }}>Settings</Nav.Link>
                    </Nav>
                </Col>
                <Col>
                    <>
                        {showCreateBooking ? <CreateBooking map_locations={map_locations}
                                                            onHide={() => setShowCreateBooking(false)}/> : null}
                        {showCurrentBookings ? <OngoingBookings onHide={() => setShowCurrentBookings(false)}/> : null}
                        {showBookingHistory ? <BookingHistory onHide={() => setShowBookingHistory(false)}/> : null}
                        {showSubmitIssue ? <SubmitIssue onHide={() => setShowBookingHistory(false)}/> : null}
                        {showDiscounts ? <Discounts onHide={() => setShowDiscounts(false)}/> : null}
                        {showSettings ?
                            <CustomerSettings isDark={isDark} toggle={toggle}
                                              onHide={() => setShowSettings(false)}/> : null}
                    </>
                </Col>
            </Row>
        </div>
    );
}

export default CustomerInterface;
