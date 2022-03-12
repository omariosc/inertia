import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.css"
import './AccountDetailsPage.css';
import {InputGroup, Button, Card, Modal, CardGroup, Row, Col, Container ,Nav} from "react-bootstrap";

function CustomerDashboard(props) {
    const userDetails = [["Full Name", "Hashir Choudry"], ["UserID", 12345]]
    return  (
        <>
            <Row >
                {/*FIRST ROW*/}
                <Col xs={4} className={"d-flex justify-content-end "}>
                    {/*FIRST COLUMN*/}
                    <h1>INERTIA</h1>
                </Col>
                <Col>
                    {/*SECOND COLUMN*/}
                    <h4>Account Information</h4>
                </Col>
                {/*SECOND COLUMN*/}
            </Row>
            <Row>
                {/*SECOND ROW*/}
                <Col xs={4}>
                    {/*FIRST COLUMN*/}
                    <Nav defaultActiveKey="/home" className="d-flex align-items-end flex-column">
                        <Nav.Link href="/home">Account Information</Nav.Link>
                        <Nav.Link eventKey="link-1">Orders</Nav.Link>
                        <Nav.Link eventKey="link-2">Payment Details</Nav.Link>
                        <Nav.Link eventKey="disabled" disabled>
                            Disabled
                        </Nav.Link>
                    </Nav>
                </Col >
                <Col>
                    {/*SECOND COLUMN*/}
                    <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet pulvinar tellus, a posuere ex. Donec efficitur accumsan eros. Praesent et pulvinar nunc, id lobortis massa. Curabitur commodo est justo, in aliquam odio imperdiet nec. Cras quis ligula ex. Ut semper orci quis massa vehicula tempus. Donec sit amet lacus a est rutrum egestas. Cras non leo enim.
                        Vestibulum venenatis ex nec lectus aliquam, nec sagittis enim egestas. Nam at felis elementum, tincidunt arcu eu, imperdiet libero. Morbi convallis nisi nec ligula bibendum vulputate. Suspendisse non sapien vestibulum, vehicula orci at, tempus purus. Nunc sed feugiat odio. Vestibulum non sem hendrerit, lobortis lectus et, aliquet velit. Morbi bibendum libero id orci condimentum, et vulputate ante egestas. Ut ut posuere elit. Phasellus vehicula, nunc eu mattis euismod, risus eros dictum neque, eu fringilla neque nisl et ligula. Nullam vitae erat tincidunt, pharetra justo commodo, mattis mauris. Quisque egestas, ante sit amet iaculis fermentum, tortor urna feugiat nisl, id rutrum erat massa elementum erat. Etiam accumsan libero non orci mattis, sit amet malesuada sem malesuada.  </p>

                    {/*<Row xs={1} md={3} className="g-4">*/}
                    {/*    {userDetails.map((dashboard, idx) => (*/}
                    {/*        <Col>*/}
                    {/*            <Card*/}
                    {/*                bg="dark"*/}
                    {/*                key={idx}*/}
                    {/*                text="white"*/}
                    {/*                style={{width: '5rem'}}*/}
                    {/*                className="mb-2"*/}
                    {/*            >*/}
                    {/*                <Card.Body>*/}
                    {/*                    <Card.Title>{dashboard[0]}</Card.Title>*/}
                    {/*                    <Card.Text>*/}
                    {/*                        {dashboard[1]}*/}
                    {/*                    </Card.Text>*/}
                    {/*                </Card.Body>*/}
                    {/*            </Card>*/}
                    {/*        </Col>*/}
                    {/*    ))}*/}
                    {/*</Row>*/}

                </Col>
            </Row>
        </>
    );
}

export default CustomerDashboard;
