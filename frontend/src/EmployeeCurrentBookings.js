import React from "react";
import {Button, Container, Table} from "react-bootstrap";
import './StaffInterface.css'

function CurrentBookings() {
    const bookings = [
        [3, 101, "sc20osc@leeds.ac.uk", "4 hours", "No", "1 hour", "17/03/22 12:54"],
        [4, 103, "sc20jdr@leeds.ac.uk", "1 day", "No", "n/a", "18/03/22 18:53"],
        [5, 105, "sc20mf@leeds.ac.uk", "1 week", "No", "n/a", "24/03/22 15:33"]
    ]
    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Current Bookings</h1>
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
                            <th>Time Expiring</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookings.map((booking, idx) => (
                            <tr>
                                <td key={idx}>{booking[0]}</td>
                                <td key={idx}>{booking[1]}</td>
                                <td key={idx}>{booking[2]}</td>
                                <td key={idx}>{booking[3]}</td>
                                <td key={idx}>{booking[4]}</td>
                                <td key={idx}>{booking[5]}</td>
                                <td key={idx}>{booking[6]}</td>
                                <td key={idx}>
                                    <Button style={{float: 'left', width: '47.5%'}} variant="success">Extend</Button>
                                    <Button style={{float: 'right', width: '47.5%'}} variant="danger">Cancel</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </>
    );
}

export default CurrentBookings;