/*
	Purpose of file: Display a list of currently ongoing bookings
	and allow a staff account to extend or cancel them
*/

import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Container, Table} from "react-bootstrap";
import { useAccount } from '../../authorize';
import showDate from "../../showDate";
import host from "../../host";

/**
 * Renders the employee ongoing bookings page which shows the employee
 * a list of current bookings
 * @returns Employee ongoing bookings page
 */
export default function EmployeeOngoingBookings() {
    const [account] = useAccount();
    const navigate = useNavigate();
    const [bookingHistory, setBookingHistory] = useState('');



    useEffect(() => {
        fetchBookings();
    }, []);

		/**
		 * Gets list of ongoing bookings from the backend server
		 */
    async function fetchBookings() {
        try {
            let request = await fetch(host + `api/admin/Orders/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                mode: "cors"
            });
            let allBookings = await request.json();
            setBookingHistory(allBookings.filter((booking) => {
                if(booking.orderState >= 1 &&  booking.orderState <= 3) {
                    if(booking.extensions.length > 0) {
                        booking.endTime = booking.extensions[booking.extensions.length-1].endTime;
                    }
                    return booking;
                }
                return null;
            }));
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" onClick={() => {navigate("/home")}}>Home</a> &gt; <b>
                <a className="breadcrumb-current" onClick={() => {navigate("/bookings")}}>Bookings</a></b>
            </p>
            <h3 id="pageName">Ongoing Bookings</h3>
            <hr id="underline"/>
            <Container className="responsive-table">
                {(bookingHistory === '') ?
                    <p>Loading booking history...</p> :
                    <>
                        {(bookingHistory.length === 0) ?
                            <p>There are currently no ongoing bookings.</p> :
                            <>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th className="minWidthFieldSmall">Customer ID</th>
                                        <th className="minWidthFieldSmall">Scooter ID</th>
                                        <th className="minWidthFieldSmall">Time Expiring</th>
                                        <th className="minWidthFieldLarge">Extend</th>
                                        <th>Cancel</th>
                                        <th>Booking Confirmation</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {(bookingHistory === '') ?
                                        <p>Loading bookings...</p> :
                                        <>
                                            {bookingHistory.map((booking, idx) => (
                                                <tr key={idx}>
                                                    <td>{booking.accountId}</td>
                                                    <td>{booking.scooter.softScooterId}</td>
                                                    <td>{showDate(booking.endTime)}</td>
                                                    <td>
                                                        <Button onClick={() => navigate("../bookings/extend/" + booking.orderId)}
                                                            variant="success">Extend</Button>
                                                    </td>
                                                    <td>
                                                        <Button onClick={() => navigate("../bookings/cancel/" + booking.orderId)}
                                                                variant="danger">Cancel</Button>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            onClick={() => navigate("../bookings/" + booking.orderId)}>
                                                            View
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    }
                                    </tbody>
                                </Table>
                            </>
                        }
                    </>
                }
            </Container>
        </>
    );
};