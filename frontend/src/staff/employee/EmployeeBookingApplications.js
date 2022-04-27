import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Container, Table} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import Cookies from "universal-cookie";
import showDate from "../../showDate";
import host from "../../host";

export default function EmployeeBookingApplications() {
    const cookies = new Cookies();
    const [bookingHistory, setBookingHistory] = useState('');
    const navigate = useNavigate();


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
                if (allBookings[i].orderState === 1) {
                    if (allBookings[i]['extensions'] != null) {
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

    async function approveBooking(id) {
        try {
            let request = await fetch(host + `api/admin/Orders/${id}/approve`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let response = await request;
            if (response.status !== 200) {
                NotificationManager.error("Could not approve booking.", "Error");
            } else {
                NotificationManager.success("Approved booking.", "Success");
            }
        } catch (e) {
            console.log(e);
        }
        await fetchBookings();
    }

    async function denyBooking(id) {
        try {
            let request = await fetch(host + `api/admin/Orders/${id}/deny`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let response = await request;
            if (response.status !== 200) {
                NotificationManager.error("Could not deny booking.", "Error");
            } else {
                NotificationManager.success("Denied booking.", "Success");
            }
        } catch (e) {
            console.log(e);
        }
        await fetchBookings();
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/home">Home
                </a> > <a className="breadcrumb-list" href="/bookings">Bookings</a> > <b>
                <a className="breadcrumb-current" href="/booking-applications">Booking Applications</a></b>
            </p>
            <h3 id="pageName">Booking Applications</h3>
            <hr id="underline"/>
            <Container>
                {(bookingHistory === '') ?
                    <p>Loading booking applications...</p> :
                    <>
                        {(bookingHistory.length === 0) ?
                            <p>There are no booking applications.</p> :
                            <>
                                <Table className="table-formatting">
                                    <thead>
                                    <tr>
                                        <th>Customer ID</th>
                                        <th>Scooter ID</th>
                                        <th>Time Expiring</th>
                                        <th>Approve</th>
                                        <th>Deny</th>
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
                                                    <td>{booking.scooterId}</td>
                                                    <td>{showDate(booking.endTime)}</td>
                                                    <td>
                                                        <Button onClick={() => approveBooking(booking.orderId)}
                                                                variant="success">Approve</Button>
                                                    </td>
                                                    <td>
                                                        <Button onClick={() => denyBooking(booking.orderId)}
                                                                variant="danger">Deny</Button>
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