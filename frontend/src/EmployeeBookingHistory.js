import React from "react";
import {Container, Table} from "react-bootstrap";
import './StaffInterface.css'

function BookingHistory() {
    const history = [
        [1, 102, "george02@gmail.com", "1 hour", "No", "1 hour", "21/02/22 17:14"],
        [2, 106, "lucyt@gmail.com", "1 day", "No", "n/a", "24/02/22 19:53"]
    ]
    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Booking History</h1>
            <br/>
            <Container>
                <div className="scroll-graphs">
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Scooter ID</th>
                            <th>Email Address</th>
                            <th>Hire Length</th>
                            <th>Cancelled</th>
                            <th>Time Extended</th>
                            <th>Time Expired</th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.map((booking, idx) => (
                            <tr>
                                <td key={idx}>{booking[0]}</td>
                                <td key={idx}>{booking[1]}</td>
                                <td key={idx}>{booking[2]}</td>
                                <td key={idx}>{booking[3]}</td>
                                <td key={idx}>{booking[4]}</td>
                                <td key={idx}>{booking[5]}</td>
                                <td key={idx}>{booking[6]}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </>
    );
}

export default BookingHistory;