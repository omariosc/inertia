import React from "react";
import {InputGroup, Button, Card, Modal, CardGroup, Row, Col} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './Manager.css';

function Dashboard(props) {
    const dashboardStatistics = [["Employees logged in", 5], ["Users logged in", 14], ["High priority issues", 4],
        ["Revenue today (£)", 490], ["Cancellations today", 2], ["Extensions today", 3],
        ["Scooters in use", 13]]
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