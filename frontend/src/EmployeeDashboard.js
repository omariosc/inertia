import React from "react";
import {Card, Row, Col, Container} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './StaffInterface.css'

function Dashboard() {
    let dashboardStatistics = {
        "Scooters in use": 1,
        "Scooters unavailable by Staff": 3,
        "Scooters pending return": 3,
        "High priority issues": 4,
        "Medium priority issues": 6,
        "Low priority issues": 1,
        "Unassigned issues": 3
    };
    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Dashboard</h1>
            <br/>
            <Container>
                <Row>
                    {Object.keys(dashboardStatistics).map((key, idx) => (
                        <Col xs={4}>
                            <Card
                                bg="light"
                                key={idx}
                                text="dark"
                                className="mb-2"
                            >
                                <Card.Body>
                                    <Card.Title>{key}</Card.Title>
                                    <Card.Text>
                                        {dashboardStatistics[key]}
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