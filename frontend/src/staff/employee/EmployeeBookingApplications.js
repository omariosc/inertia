import React, {useEffect, useState} from "react";
import {Button, Container, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import orderState from "../orderState";
import host from "../../host";
import Cookies from "universal-cookie";
import showDate from "../../showDate";

export default function EmployeeBookingApplications() {
    const cookies = new Cookies();
    const [bookingHistory, setBookingHistory] = useState('');
    const [booking, setBooking] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        try {
            let request = await fetch(host + `api/admin/Orders/AccountOrders`, {
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
                alert("Could not approve booking.");
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
                alert("Could not deny booking.");
            }
        } catch (e) {
            console.log(e);
        }
        await fetchBookings();
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home
                </a> > <a className="breadcrumb-list" href="/bookings">Bookings</a> > <b>
                <a className="breadcrumb-current" href="/booking-applications">Booking Applications</a></b>
            </p>
            <h3 id="pageName">Booking Applications</h3>
            <hr id="underline"/>
            <br/>
            <Container>
                {(bookingHistory === '') ?
                    <p>Loading booking applications...</p> :
                    <>
                        {(bookingHistory.length === 0) ?
                            <p>There are no bookings pending for approval.</p> :
                            <>
                                {(booking === '') ?
                                    <p>Select a booking to show booking details</p> :
                                    <>
                                        <Table>
                                            <tbody>
                                            <tr>
                                                <td><b>Booking ID:</b></td>
                                                <td>{booking.orderId}</td>
                                            </tr>
                                            {(booking.accountId) ?
                                                <tr>
                                                    <td><b>Customer ID:</b></td>
                                                    <td>{booking.accountId}</td>
                                                </tr> : null
                                            }
                                            {(booking.account) ?
                                                <>
                                                    {(booking.account.name) ?
                                                        <tr>
                                                            <td><b>Customer Name:</b></td>
                                                            <td>{booking.account.name}</td>
                                                        </tr>
                                                        : null
                                                    }
                                                </>
                                                : null
                                            }
                                            <tr>
                                                <td><b>Cost:</b></td>
                                                <td>£{booking.cost.toFixed(2)}</td>
                                            </tr>
                                            {(booking.discount > 0) ?
                                                <tr>
                                                    <td><b>Discount:</b></td>
                                                    <td>{booking.discount * 100}%</td>
                                                </tr> : null
                                            }
                                            <tr>
                                                <td><b>Created At:</b></td>
                                                <td>{showDate(booking.createdAt)}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Start Time:</b></td>
                                                <td>{showDate(booking.startTime)}</td>
                                            </tr>
                                            <tr>
                                                <td><b>End Time:</b></td>
                                                <td>{showDate(booking.endTime)}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Order Status:</b></td>
                                                <td>{orderState[booking.orderState]}</td>
                                            </tr>
                                            </tbody>
                                        </Table>
                                        <Button className="float-right" onClick={() => setBooking("")}
                                                variant="danger">Close</Button>
                                    </>
                                }
                                <br/>
                                <Table>
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
                                                <tr>
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
                                                        <Button onClick={() => setBooking(bookingHistory[idx])}>
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