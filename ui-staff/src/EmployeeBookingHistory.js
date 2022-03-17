import React from "react";
import {Table} from "react-bootstrap";
import './StaffInterface.css'

function BookingHistory() {
    const history = [
        [1, 102, "george02", "1 hour", "No", "1 hour", "21/02/22 17:14"],
        [2, 106, "LucyT", "1 day", "No", "n/a", "24/02/22 19:53"]
        ]
    return (
        <>
            <h1>Booking History</h1>
            <div class="scroll-bookings">
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Scooter ID</th>
                        <th>Username</th>
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
        </>
    );
}

export default BookingHistory;