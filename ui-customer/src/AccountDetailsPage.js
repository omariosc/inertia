import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.css"
import './AccountDetailsPage.css';
import {InputGroup, Button, Card, Table, CardGroup, Row, Col, Container ,Nav} from "react-bootstrap";
import {text} from "@fortawesome/fontawesome-svg-core";

function CustomerDashboard(props) {
    const userDetails = [["Full Name", "Hashir Choudry"], ["UserID", 12345],  ["Email Address", "hashirsing@gmail.com"],
        ["Phone Number", "0774891234"], ["Password", "**********"]]

    return  (
        <>
            <Row >
                {/*FIRST ROW*/}
                <Col xs={4} className={"d-flex justify-content-end border-end border-dark"}>
                    {/*FIRST COLUMN*/}
                    <h1>INERTIA</h1>
                </Col>
                <Col>
                    {/*SECOND COLUMN*/}
                    <h4>Account Information</h4>
                </Col>
                {/*SECOND COLUMN*/}
            </Row>
            <Row className={""}>
                {/*SECOND ROW*/}
                <Col xs={4} className={"border-end border-dark"}>
                    {/*FIRST COLUMN*/}
                    <Nav defaultActiveKey="/home" className="d-flex align-items-end flex-column">
                        <Nav.Link href="/home">Account Info</Nav.Link>
                        <Nav.Link eventKey="link-1">Orders</Nav.Link>
                        <Nav.Link eventKey="link-2">Payment Details</Nav.Link>
                        <Nav.Link eventKey="disabled" disabled>
                            Disabled
                        </Nav.Link>
                    </Nav>
                </Col >
                <Col>
                    {/*SECOND COLUMN*/}

                    {/*TABLE FOR USER INFORMATION LIKE USERID AND EMAIL ETC*/}
                    <Table>
                        <tbody>
                        {userDetails.map((title, info) => (
                            <tr>
                                <td>{title[0]}</td>
                                <td>{title[1]}</td>
                                <td><u>edit</u></td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>


                </Col>
            </Row>
        </>
    );
}

export default CustomerDashboard;
