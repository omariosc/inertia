import React, {useState, useEffect} from "react";
import {Card, Row, Col, Container} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './StaffInterface.css';
import host from './host';
import Cookies from 'universal-cookie';

export default function Dashboard() {
    const cookies = new Cookies();
    const [data, setData] = useState('');

    useEffect(() => {
        fetchDashboard()
    }, []);

    async function fetchDashboard() {
        const request = await fetch(host + "api/admin/Dashboard", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${cookies.get('accessToken')}`
            },
            mode: "cors"
        });
        let responseJson = await request.json();
        setData({
            "Scooters in use": responseJson.scootersInUse,
            "Scooters unavailable by Staff": responseJson.scootersUnavailableByStaff,
            "Scooters pending return": responseJson.scootersPendingReturn,
            "High priority issues": responseJson.highPriorityIssues,
            "Medium priority issues": responseJson.mediumPriorityIssues,
            "Low priority issues": responseJson.lowPriorityIssues,
            "Unassigned issues": responseJson.unassignedPriorityIssues
        })
    }

    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Dashboard</h1>
            <br/>
            <Container>
                {(data === "") ?
                    <h5>Loading...</h5>
                    : <div>
                        <Row>
                            {Object.keys(data).map((key, idx) => (
                                <Col xs={4}>
                                    <Card
                                        bg="light"
                                        key={idx}
                                        text="dark"
                                        className="mb-2">
                                        <Card.Body>
                                            <Card.Title>{key}</Card.Title>
                                            <Card.Text>{data[key]}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                }
            </Container>
        </>
    )
}