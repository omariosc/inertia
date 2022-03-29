import React from "react";
import {Button, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './StaffInterface.css';

export default function CurrentBookings() {
    const bookings = [
        [101, "4 hours", "12/04/22 12:54"],
        [103, "1 day", "25/05/22 18:53"],
        [105, "1 week", "14/05/22 15:33"]
    ]
    return (
        <div className="scroll">
            <Table>
                <thead>
                <tr>
                    <th>Scooter ID</th>
                    <th>Hire Length</th>
                    <th>Time Expiring</th>
                    <th>Extend</th>
                    <th>Cancel</th>
                    <th>Booking Confirmation</th>
                </tr>
                </thead>
                <tbody>
                {bookings.map((booking) => (
                    <tr>
                        <td>{booking[0]}</td>
                        <td>{booking[1]}</td>
                        <td>{booking[2]}</td>
                        <td>
                            <Button variant="success">Extend</Button>
                        </td>
                        <td>
                            <Button variant="danger">Cancel</Button>
                        </td>
                        <td><u>View</u></td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}