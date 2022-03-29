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

    useEffect(() => {
        fetchUserBookings();
        fetchGuestBookings()
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
                                                               href="#/employee-view-booking">View</a>
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
                                                               href="#/employee-view-booking">View</a>
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
                                <tr>
                                    <td><b>Scooter ID:</b></td>
                                    <td>{booking.scooterId}</td>
                                </tr>
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
                                    <td>{booking.createdAt}</td>
                                </tr>
                                <tr>
                                    <td><b>Start Time:</b></td>
                                    <td>{booking.startTime}</td>
                                </tr>
                                <tr>
                                    <td><b>End Time:</b></td>
                                    <td>{booking.endTime}</td>
                                </tr>
                                </tbody>
                            </Table>
                        }
                    </Col>
                </Row>
            </Container>
        </>
    );
}