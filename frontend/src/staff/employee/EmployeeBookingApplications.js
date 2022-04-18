import React, {useEffect, useState} from "react";
import {Container, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import host from "../../host";
import Cookies from "universal-cookie";
import '../StaffInterface.css';

export default function BookingApplications() {
    const cookies = new Cookies();
    const [bookingHistory, setBookingHistory] = useState('');
    const [booking, setBooking] = useState('');
    const orderState = ["Cancelled", "Pending Approval", "Upcoming", "Ongoing", "Pending Return", "Completed", "Denied"];

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
            if (response.status === 200) {
                alert("Approved booking.");
            } else {
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
            if (response.status === 200) {
                alert("Denied booking.");
            } else {
                alert("Could not deny booking.");
            }
        } catch (e) {
            console.log(e);
        }
        await fetchBookings();
    }

    function showDate(date) {
        return new Intl.DateTimeFormat('en', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(new Date(date));
    }

    return (
        <>
            <h1 id={"pageName"}>Booking Applications</h1>
            <br/>
            <Container>
                {(bookingHistory === '') ?
                    <h6>Loading booking applications...</h6> :
                    <>
                        {(bookingHistory.length === 0) ?
                            <h6>There are no bookings pending for approval.</h6> :
                            <>
                                <div className="scroll">
                                    {(booking === '') ?
                                        <h6>Select a booking to show booking details</h6> :
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
                                            <tr>
                                                <td><b>Discount:</b></td>
                                                <td>{booking.discount*100}%</td>
                                            </tr>
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
                                                <td><b>Extensions:</b></td>
                                                <td>{((booking.extensions.length !== 0) ? booking.extensions.length : "None")}</td>
                                            </tr>
                                            <tr>
                                                <td><b>Order Status:</b></td>
                                                <td>{orderState[booking.orderState]}</td>
                                            </tr>
                                            </tbody>
                                        </Table>
                                    }
                                    <br/>
                                    <Table>
                                        <thead>
                                        <tr>
                                            <th>Customer ID</th>
                                            <th>Scooter ID</th>
                                            <th>Time Expiring</th>
                                            <th>Approve</th>
                                            <th>Deny4</th>
                                            <th>Booking Confirmation</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {(bookingHistory === '') ?
                                            <h6>Loading bookings...</h6> :
                                            <>
                                                {bookingHistory.map((booking, idx) => (
                                                    <tr>
                                                        <td>{booking.accountId}</td>
                                                        <td>{booking.scooterId}</td>
                                                        <td>{showDate(booking.endTime)}</td>
                                                        <td>
                                                            <a onClick={() => approveBooking(booking.orderId)}
                                                               color="green"
                                                               href="#/employee-approve"
                                                            >Approve</a>
                                                        </td>
                                                        <td>
                                                            <a onClick={() => denyBooking(booking.orderId)}
                                                               color="red"
                                                               href="#/employee-deny"
                                                            >Deny</a>
                                                        </td>
                                                        <td>
                                                            <a onClick={() => setBooking(bookingHistory[idx])}
                                                               href="#/employee-view-booking">View</a></td>
                                                    </tr>
                                                ))}
                                            </>
                                        }
                                        </tbody>
                                    </Table>
                                </div>
                            </>
                        }
                    </>
                }
            </Container>
        </>
    );
};