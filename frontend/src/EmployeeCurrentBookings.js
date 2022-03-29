import React from "react";
import {Button, Container, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './StaffInterface.css';

export default function CurrentBookings() {
    const bookings = [
        [101, "sc20osc@leeds.ac.uk", "4 hours", "17/03/22 12:54"],
        [103, "sc20jdr@leeds.ac.uk", "1 day", "18/03/22 18:53"],
        [105, "sc20mf@leeds.ac.uk", "1 week", "24/03/22 15:33"]
    ]
    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Current Bookings</h1>
            <br/>
            <Container>
                <div className="scroll" style={{maxHeight: "40rem", overflowX: "hidden"}}>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Scooter ID</th>
                            <th>Email Address</th>
                            <th>Hire Length</th>
                            <th>Time Expiring</th>
                            <th>Action</th>
                            <th>Booking Confirmation</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookings.map((booking) => (
                            <tr>
                                <td>{booking[0]}</td>
                                <td>{booking[1]}</td>
                                <td>{booking[2]}</td>
                                <td>{booking[3]}</td>
                                <td>
                                    <Button style={{float: 'left', width: '47.5%'}} variant="success">Extend</Button>
                                    <Button style={{float: 'right', width: '47.5%'}} variant="danger">Cancel</Button>
                                </td>
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