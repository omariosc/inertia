import React, {useEffect, useState} from "react";
import {Button, Col, Container, Row, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import showDate from "../../showDate";
import host from '../../host';
import orderState from "../orderState";
import Cookies from 'universal-cookie';

export default function EmployeeBookingHistory() {
    const cookies = new Cookies();
    const [userBookings, setUserBookings] = useState('');
    const [guestBookings, setGuestBookings] = useState('');
    const [booking, setBooking] = useState('');

    useEffect(() => {
        fetchUserBookings();
        fetchGuestBookings();
    }, []);

    async function fetchUserBookings() {
        try {
            let request = await fetch(host + "api/admin/Orders/AccountOrders", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            setUserBookings(await request.json());
        } catch (e) {
            console.log(e);
        }
    }

    async function fetchGuestBookings() {
        try {
            let request = await fetch(host + "api/admin/Orders/GuestOrders", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            setGuestBookings(await request.json());
        } catch (e) {
            console.log(e);
        }
    }

    function displayBooking(id, choice) {
        if (choice === "user") {
            setBooking(userBookings[id]);
        } else {
            setBooking(guestBookings[id]);
        }
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home
                </a> > <a className="breadcrumb-list" href="/bookings">Bookings</a> > <b>
                <a className="breadcrumb-current" href="/booking-history44">Booking History</a></b>
            </p>
            <h3 id="pageName">Booking History</h3>
            <hr id="underline"/>
            <br/>
            <Container>
                <Row xs={1}>
                    <Col xs={6}>
                        <h5 className="large-padding-bottom">All Bookings</h5>
                        {(userBookings === '' || guestBookings === '') ?
                            <p>Loading bookings...</p> :
                            <Table className="table-formatting">
                                <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Booking Details</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(userBookings === '') ? null :
                                    <>
                                        {userBookings.map((booking, idx) => (
                                            <tr key={idx}>
                                                <td>{booking.orderId}</td>
                                                <td>
                                                    <Button onClick={() => displayBooking(idx, "user")}>
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                }
                                {(guestBookings === '') ? null :
                                    <>
                                        {guestBookings.map((booking, idx) => (
                                            <tr key={idx}>
                                                <td>{booking.orderId}</td>
                                                <td>
                                                    <Button onClick={() => displayBooking(idx, "guest")}>
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                }
                                </tbody>
                            </Table>
                        }
                    </Col>
                    <Col xs={1}/>
                    <Col xs={5}>
                        <h5 className="large-padding-bottom">Booking Details</h5>
                        {(booking === '') ?
                            <>Select a booking to show booking details</> :
                            <Table>
                                <tbody>
                                <tr>
                                    <td><b>Booking ID:</b></td>
                                    <td>{booking.orderId}</td>
                                </tr>
                                {(booking.scooter) ?
                                    <>
                                        <tr>
                                            <td><b>Scooter ID:</b></td>
                                            <td>{booking.scooter.softScooterId}</td>
                                        </tr>
                                        {(booking.scooter.depo) ?
                                            <tr>
                                                <td><b>Depot:</b></td>
                                                <td>{booking.scooter.depo.name}</td>
                                            </tr> : null
                                        }
                                    </>
                                    :
                                    <tr>
                                        <td><b>Scooter:</b></td>
                                        <td>{booking.scooterId}</td>
                                    </tr>
                                }
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
                                {(booking.hireOption) ?
                                    <tr>
                                        <td><b>Hire Option:</b></td>
                                        <td>{booking.hireOption.name}</td>
                                    </tr>
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
                        }
                    </Col>
                </Row>
            </Container>
        </>
    );
};