import React from "react";
import {Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import './StaffInterface.css';

export default function BookingHistory() {
    const orderDetails = [
        [101, "1 hour", "8/2/22 13:02", 10],
        [102, "1 week", "9/2/22 16:45", 0],
        [103, "4 hours", "11/2/22 19:52", 30],
        [205, "1 hour", "15/2/22 09:24", 10],
        [204, "1 day", "20/2/22 10:45", 200]
    ];
    return (
        <div className="scroll">
            <Table>
                <thead>
                <tr>
                    <th>Scooter</th>
                    <th>Hire Length</th>
                    <th>Time Expired</th>
                    <th>Amount Paid</th>
                    <th>Booking Confirmation</th>
                </tr>
                </thead>
                <tbody>
                {orderDetails.map((details) => (
                    <tr>
                        <td>{details[0]}</td>
                        <td>{details[1]}</td>
                        <td>{details[2]}</td>
                        <td>£{(details[3]).toFixed(2)}</td>
                        <td><u>View</u></td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};