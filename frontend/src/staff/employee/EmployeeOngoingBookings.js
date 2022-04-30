import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Container, Table} from "react-bootstrap";
import Cookies from "universal-cookie";
import showDate from "../../showDate";
import host from "../../host";

export default function EmployeeOngoingBookings() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const [bookingHistory, setBookingHistory] = useState('');



    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        try {
            let request = await fetch(host + `api/admin/Orders/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let allBookings = await request.json();
            let ongoingBookings = [];
            for (let i = 0; i < allBookings.length; i++) {
                if (allBookings[i].orderState === 1 || allBookings[i].orderState === 2 || allBookings[i].orderState === 3) {
                    if (allBookings[i]['extensions'].length > 0) {
                        allBookings[i].endTime = allBookings[i]['extensions'][allBookings[i]['extensions'].length - 1].endTime;
                    }
                    ongoingBookings.push(allBookings[i]);
                }
            }
            setBookingHistory(ongoingBookings);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/home">Home</a> > <b>
                <a className="breadcrumb-current" href="/bookings">Bookings</a></b>
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