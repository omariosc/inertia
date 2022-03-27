import React from "react";
import {Container, Table} from "react-bootstrap";
import './StaffInterface.css';

export default function BookingHistory() {
    const history = [
        [102, "george02@gmail.com", "1 hour", "21/02/22 17:14"],
        [106, "lucyt@gmail.com", "1 day", "24/02/22 19:53"]
    ]
    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Booking History</h1>
            <br/>
            <Container>
                <div className="scroll">
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Scooter ID</th>
                            <th>Email Address</th>
                            <th>Hire Length</th>
                            <th>Time Expired</th>
                            <th>Booking Confirmation</th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.map((booking) => (
                            <tr>
                                <td>{booking[0]}</td>
                                <td>{booking[1]}</td>
                                <td>{booking[2]}</td>
                                <td>{booking[3]}</td>
                                <td><u>View</u></td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </>
    );
}