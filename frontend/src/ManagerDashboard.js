import React, {Component} from "react";
import {Card, Row, Col, Container} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './StaffInterface.css'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

// async function DashboardStatistics() {
//     let dashboardStatistics = {
//         "Employees logged in": 0,
//         "Users logged in": 0,
//         "High priority issues": 0,
//         "Revenue today (£)": 0,
//         "Scooters in use": 0
//     };
//     try {
//         const req = await fetch("https://localhost:7220/api/admin/Dashboard", {
//             method: "GET",
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json',
//                 'Authorization': `Bearer ${cookies.get('accessToken')}`
//             },
//             mode: "cors"
//         });
//         const response = await req.json();
//         dashboardStatistics["Employees logged in"] = response.employeesLoggedIn;
//         dashboardStatistics["Users logged in"] = response.usersLoggedIn;
//         dashboardStatistics["High priority issues"] = response.highPriorityIssues;
//         dashboardStatistics["Revenue today (£)"] = response.revenueToday;
//         dashboardStatistics["Scooters in use"] = response.scootersInUse;
//         console.log(dashboardStatistics);
//     } catch (e) {
//         console.log(e);
//     }
//     return (
//         <>
//             {Object.keys(dashboardStatistics).map((key, idx) => (
//                 <Col xs={4}>
//                     <Card
//                         bg="light"
//                         key={idx}
//                         text="dark"
//                         className="mb-2"
//                     >
//                         <Card.Body>
//                             <Card.Title>{key}</Card.Title>
//                             <Card.Text>
//                                 {dashboardStatistics[key]}
//                             </Card.Text>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             ))}
//         </>
//     );
// }

function Dashboard() {
    let dashboardStatistics = {
        "Employees logged in": 3,
        "Users logged in": 2,
        "High priority issues": 1,
        "Revenue today (£)": 4,
        "Scooters in use": 6
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