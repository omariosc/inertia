import React, {useEffect, useState} from "react";
import {Button, Container, Form, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import orderState from "../orderState";
import host from "../../host";
import Cookies from "universal-cookie";

export default function EmployeeOngoingBookings() {
    const cookies = new Cookies();
    const [bookingHistory, setBookingHistory] = useState('');
    const [booking, setBooking] = useState('');
    const [hireOptions, setHireOptions] = useState('');
    const [hireChoiceId, setHireChoiceId] = useState('');

    useEffect(() => {
        fetchBookings();
        fetchHirePeriods();
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
                if (allBookings[i].orderState === 1 || allBookings[i].orderState === 2 || allBookings[i].orderState === 3) {
                    ongoingBookings.push(allBookings[i]);
                }
            }
            setBookingHistory(ongoingBookings);
        } catch (e) {
            console.log(e);
        }
    }

    async function fetchHirePeriods() {
        try {
            let request = await fetch(host + "api/HireOptions", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            setHireOptions(await request.json());
        } catch (error) {
            console.error(error);
        }
    }

    async function extendBooking(id) {
        try {
            let request = await fetch(host + `api/admin/Orders/${id}/extend`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    'hireOptionId': parseInt(hireChoiceId)
                }),
                mode: "cors"
            });
            let response = await request;
            if (response.status !== 200) {
                alert("Could not extend booking.");
            }
        } catch (e) {
            console.log(e);
        }
        await fetchBookings();
    }

    async function cancelBooking(id) {
        try {
            let request = await fetch(host + `api/admin/Orders/${id}/cancel`, {
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
                alert("Could not cancel booking.");
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
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home
                </a> > <a className="breadcrumb-list" href="/create-guest-booking">Bookings</a> > <b>
                <a className="breadcrumb-current" href="/ongoing-bookings">Ongoing Bookings</a></b>
            </p>
            <h3 id="pageName">Ongoing Bookings</h3>
            <hr id="underline"/>
            <br/>
            <Container>
                {(bookingHistory === '') ?
                    <p>Loading booking history...</p> :
                    <>
                        {(bookingHistory.length === 0) ?
                            <p>You have no bookings.</p> :
                            <>
                                <div className="scroll">
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
                                            <Button style={{float: "right"}} onClick={() => setBooking("")}
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
                                            <th>Extend</th>
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
                                                            {(hireOptions === '') ?
                                                                <p>Loading hire options...</p> :
                                                                <Form.Select
                                                                    onChange={(e) => {
                                                                        setHireChoiceId(e.target.value);
                                                                    }}
                                                                >
                                                                    <option value="none" key="none" selected
                                                                            disabled hidden>
                                                                        Select hire period
                                                                    </option>
                                                                    {hireOptions.map((option, idx) => (
                                                                        <option key={idx}
                                                                                value={option.hireOptionId}>{option.name} -
                                                                            £{option.cost}</option>
                                                                    ))}
                                                                </Form.Select>
                                                            }
                                                            <Button
                                                                onClick={() => extendBooking(booking.orderId)}
                                                                variant="success">Extend</Button>
                                                        </td>
                                                        <td>
                                                            <Button onClick={() => cancelBooking(booking.orderId)}
                                                                    variant="danger">Cancel</Button>
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
                                </div>
                            </>
                        }
                    </>
                }
            </Container>
        </>
    );
};