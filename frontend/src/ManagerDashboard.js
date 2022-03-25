import React, {Component} from "react";
import {Card, Row, Col, Container} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './StaffInterface.css';
import host from './host';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state =
            {
                data: {},
                loading: true
            };
    }

    componentDidMount() {
        this.fetchDashboard();
    }

    render() {
        if (this.state.loading) {
            return (
                <>
                </>
            );
        }

        return (
            <>
                <h1 style={{paddingLeft: '10px'}}>Dashboard</h1>
                <br/>
                <Container>
                    <Row>
                        {Object.keys(this.state.data).map((key, idx) => (
                            <Col xs={4}>
                                <Card
                                    bg="light"
                                    key={idx}
                                    text="dark"
                                    className="mb-2">
                                    <Card.Body>
                                        <Card.Title>{key}</Card.Title>
                                        <Card.Text>
                                            {this.state.data[key]}
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

    async fetchDashboard() {
        const response = await fetch(host + "api/admin/Dashboard", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${cookies.get('accessToken')}`
            },
            mode: "cors"
        });

        const data = await response.json();
        this.setState({
            data: {
                "Employees logged in": data.employeesLoggedIn,
                "Users logged in": data.usersLoggedIn,
                "High priority issues": data.revenueToday,
                "Revenue today (£)": data.revenueToday,
                "Scooters in use": data.scootersInUse
            }, loading: false
        });
    }
}


export default Dashboard;