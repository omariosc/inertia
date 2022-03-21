import React from "react";
import {Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css"

function Orders() {
    const orderDetails = [["12345", 12, "12:45, 8/2/22", "12:45, 6/7/99", 12],
        ["12345", 12, "12:45, 8/2/22", "12:45, 6/7/99", 12],
        ["12345", 12, "12:45, 8/2/22", "12:45, 6/7/99", 12],
        ["12345", 12, "12:45, 8/2/22", "12:45, 6/7/99", 12],
        ["12345", 12, "12:45, 8/2/22", "12:45, 6/7/99", 12]]
    return (
        <>
            <h4>Orders</h4>
            <Table>
                <thead>
                <th>Booking ID</th>
                <th>Hire Period</th>
                <th>Time Booked</th>
                <th>Time Returned</th>
                <th>Amount Paid</th>
                </thead>
                <tbody>
                {orderDetails.map((details, info) => (
                    <tr key={info}>
                        <td>{details[0]}</td>
                        <td>{details[1]}</td>
                        <td>{details[2]}</td>
                        <td>{details[3]}</td>
                        <td>£{(details[4]).toFixed(2)}</td>
                        <td><u>Support</u></td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </>
    )
}

export default Orders;