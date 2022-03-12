import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.css"
import './AccountDetailsPage.css';
import {InputGroup, Button, Card, Modal, CardGroup, Row, Col, Container ,Nav} from "react-bootstrap";

function CustomerDashboard(props) {
    const userDetails = [["Full Name", "Hashir Choudry"], ["UserID", 12345]]
    return  (
        <>
            <Row>
                {/*FIRST ROW*/}
                {/*FIRST COLUMN*/}
                <Col md={"auto"}>
                    <h1 id={"inertia"}>INERTIA</h1>
                </Col>
                {/*SECOND COLUMN*/}
                <Col></Col>
            </Row>
            <Row>
                {/*SECOND ROW*/}
                <Col md={"auto"}>
                    {/*FIRST COLUMN*/}
                    <div id={"container"}>
                        <Nav defaultActiveKey="/home" className="d-flex align-items-end flex-column">
                            <Nav.Link href="/home">Active</Nav.Link>
                            <Nav.Link eventKey="link-1">Link</Nav.Link>
                            <Nav.Link eventKey="link-2">Link</Nav.Link>
                            <Nav.Link eventKey="disabled" disabled>
                                Disabled
                            </Nav.Link>
                        </Nav>

                    </div>
                </Col>
                {/*SECOND COLUMN*/}
                <Col>
                    <Row xs={1} md={3} className="g-4">
                        {userDetails.map((dashboard, idx) => (
                            <Col>
                                <Card
                                    bg="dark"
                                    key={idx}
                                    text="white"
                                    style={{width: '5rem'}}
                                    className="mb-2"
                                >
                                    <Card.Body>
                                        <Card.Title>{dashboard[0]}</Card.Title>
                                        <Card.Text>
                                            {dashboard[1]}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                </Col>
            </Row>
        </>
    );
}

export default CustomerDashboard;
