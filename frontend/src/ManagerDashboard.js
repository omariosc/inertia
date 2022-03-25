import React, {Component} from "react";
import {Card, Row, Col, Container} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './StaffInterface.css';
import host from './host';
import Cookies from 'universal-cookie';

function Dashboard() {
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
            "Employees logged in": responseJson.employeesLoggedIn,
            "Users logged in": responseJson.usersLoggedIn,
            "High priority issues": responseJson.revenueToday,
            "Revenue today": "£"+responseJson.revenueToday.toString(),
            "Scooters in use": responseJson.scootersInUse
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


export default Dashboard;