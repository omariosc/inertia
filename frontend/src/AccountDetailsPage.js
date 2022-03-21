import React, {useState} from "react";
import {Table, Row, Col, Nav} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css"
import Orders from "./CustomerOrders";
import PaymentDetails from "./AccountPaymentDetails";
import Settings from './Settings.js';
import './StaffInterface.css';

function CustomerDashboard() {
    const userDetails = [["Full Name", "Hashir Choudry"], ["UserID", 12345], ["Email Address", "hashirsing@gmail.com"],
        ["Phone Number", "0774891234"], ["Password", "**********"]];
    const [showInfo, setInfo] = useState(true);
    const [showOrders, setOrders] = useState(false);
    const [showPaymentDetails, setPaymentDetails] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    return (
        <div id="account-page">
            <Row>
                <Col xs={4} className="d-flex justify-content-end border-end border-dark">
                    <h1>INERTIA</h1>
                </Col>
                <Col>
                    <h4>Account Information</h4>
                </Col>
            </Row>
            <Row>
                <Col xs={4} className="border-end border-dark">
                    <Nav defaultActiveKey="#/account" className="align-items-end flex-column">
                        <Nav.Link href="#/account"
                                  onClick={() => {
                                      setInfo(true);
                                      setOrders(false);
                                      setPaymentDetails(true);
                                      setShowSettings(false);
                                  }}>Account Information</Nav.Link>
                        <Nav.Link href="#/current-bookings"
                                  onClick={() => {
                                      setInfo(false);
                                      setOrders(false);
                                      setPaymentDetails(false);
                                      setShowSettings(false);
                                  }}>Current Bookings</Nav.Link>
                        <Nav.Link href="#/booking-history"
                                  onClick={() => {
                                      setInfo(false);
                                      setOrders(true);
                                      setPaymentDetails(false);
                                      setShowSettings(false);
                                  }}>Booking History</Nav.Link>
                        <Nav.Link href="#/submit-issue"
                                  onClick={() => {
                                      setInfo(false);
                                      setOrders(false);
                                      setPaymentDetails(false);
                                      setShowSettings(false);
                                  }}>Submit Issue</Nav.Link>
                        <Nav.Link href="#/settings"
                                  onClick={() => {
                                      setInfo(false);
                                      setOrders(false);
                                      setPaymentDetails(false);
                                      setShowSettings(true);
                                  }}>Settings</Nav.Link>
                    </Nav>
                </Col>
                <Col>
                    {showInfo ?
                    <Table>
                        <tbody>
                        {userDetails.map((title, info) => (
                            <tr key={info}>
                                <td>{title[0]}</td>
                                <td>{title[1]}</td>
                                <td><u>edit</u></td>
                            </tr>
                        ))}
                        </tbody>
                    </Table> : null}
                    <>
                        {showOrders ? <Orders onHide={() => setOrders(false)}/> : null}
                        {showPaymentDetails ? <PaymentDetails onHide={() => setPaymentDetails(false)}/> : null}
                        {showSettings ? <Settings onHide={() => setShowSettings(false)}/> : null}
                    </>
                </Col>
            </Row>
        </div>
    );
}

export default CustomerDashboard;
