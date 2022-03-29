import React, {useEffect, useState} from "react";
import {Card, Col, Container, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import host from './host';
import Cookies from 'universal-cookie';
import './StaffInterface.css';

export default function Dashboard() {
    const cookies = new Cookies();
    const [data, setData] = useState('');

    useEffect(() => {
        fetchDashboard()
    }, []);

    async function fetchDashboard() {
        let request = await fetch(host + "api/admin/Dashboard", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${cookies.get('accessToken')}`
            },
            mode: "cors"
        });
        let responseJson = await request.json();
        if (cookies.get("accountRole") === '2') {
            setData({
                "Employees logged in": responseJson.employeesLoggedIn,
                "Users logged in": responseJson.usersLoggedIn,
                "High priority issues": responseJson.highPriorityIssues,
                "Revenue today": "£" + responseJson.revenueToday.toString(),
                "Scooters in use": responseJson.scootersInUse
            });
        } else if (cookies.get("accountRole") === '1') {
            setData({
                "Scooters in use": responseJson.scootersInUse,
                "Scooters unavailable by Staff": responseJson.scootersUnavailableByStaff,
                "Scooters pending return": responseJson.scootersPendingReturn,
                "High priority issues": responseJson.highPriorityIssues,
                "Medium priority issues": responseJson.mediumPriorityIssues,
                "Low priority issues": responseJson.lowPriorityIssues,
                "Unassigned issues": responseJson.unassignedPriorityIssues
            });
        }
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
                                <Col xs={4} key={idx}>
                                    <Card className="mb-2">
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
    );
};