import React, {useEffect, useState} from "react";
import {Col, Container, Row, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import host from './host';
import Cookies from 'universal-cookie';
import './StaffInterface.css';

export default function BookingHistory() {
    const cookies = new Cookies();
    const [userBookings, setUserBookings] = useState('');
    const [guestBookings, setGuestBookings] = useState('');
    const [booking, setBooking] = useState('');
    const [showBooking, setShowBooking] = useState(false);
    const orderState = ["Cancelled", "PendingApproval", "Upcoming", "Ongoing", "PendingReturn", "Completed", "Denied"];

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
        setShowBooking(true);
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
            <h1 style={{paddingLeft: '10px'}}>Booking History</h1>
            <br/>
            <Container>
                <Row xs={1}>
                    <Col xs={6}>
                        <h3 style={{paddingBottom: "20px"}}>All Bookings</h3>
                        {(userBookings === '' || guestBookings === '') ?
                            <h6>Loading...</h6> :
                            <>
                                <div className="scroll" style={{maxHeight: "40rem"}}>
                                    <Table striped bordered hover>
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
                                                        <td><a onClick={() => displayBooking(idx, "user")}
                                                               href="#/employee-view-user-booking">View</a>
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
                                                        <td><a onClick={() => displayBooking(idx, "guest")}
                                                               href="#/employee-view-guest-booking">View</a>
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
                    </Col>
                    <Col xs={1}/>
                    <Col xs={5}>
                        <h3 style={{paddingBottom: "20px"}}>Booking Details</h3>
                        {(booking === '') ?
                            <h6>Select a booking to show booking details</h6> :
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
                                    <td>£{booking.cost}</td>
                                </tr>
                                <tr>
                                    <td><b>Discount:</b></td>
                                    <td>£{booking.discount}</td>
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
                    </Col>
                </Row>
            </Container>
        </>
    );
};