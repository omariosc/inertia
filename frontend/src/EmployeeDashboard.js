import React from "react";
import {Card, Row, Col, Container} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './StaffInterface.css'

function Dashboard() {
    const dashboardStatistics = [["Scooters in use", 3], ["Upcoming Bookings Today", 5], ["High priority issues", 1],
        ["Medium priority issues", 1], ["Low priority issues", 1], ["Unassigned issues", 1],
        ["Cancellations today", 0], ["Extensions today", 0], ["Pending Discount Applications", 1]]
    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Dashboard</h1>
            <br/>
            <Container>
                <Row>
                    {dashboardStatistics.map((dashboard, idx) => (
                        <Col xs={4}>
                            <Card
                                bg="light"
                                key={idx}
                                text="dark"
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
            </Container>
        </>
    );
}

export default Dashboard;