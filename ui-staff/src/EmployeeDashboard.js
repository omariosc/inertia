import React from "react";
import {Card, Row, Col} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './StaffInterface.css'

function Dashboard() {
    const dashboardStatistics = [["Scooters in use", 3], ["Upcoming Bookings Today", 5], ["High priority issues", 1],
        ["Medium priority issues", 1], ["Low priority issues", 1], ["Unassigned issues", 1],
        ["Cancellations today", 0], ["Extensions today", 0], ["Pending Discount Applications", 1]]
    return (
        <>
            <h1>Dashboard</h1>
            <Row xs={1} md={3} className="g-4">
                {dashboardStatistics.map((dashboard, idx) => (
                    <Col>
                        <Card
                            bg="dark"
                            key={idx}
                            text="white"
                            style={{width: '18rem'}}
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
        </>
    );
}

export default Dashboard;