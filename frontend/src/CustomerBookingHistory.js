import React, {useEffect, useState} from "react";
import {Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import host from './host';
import Cookies from 'universal-cookie';

export default function BookingHistory() {
    const cookies = new Cookies();
    const [bookingHistory, setBookingHistory] = useState('');
    const [booking, setBooking] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        try {
            let request = await fetch(host + `api/Users/${cookies.get('accountID')}/orders`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            setBookingHistory(await request.json());
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            {(bookingHistory === '') ?
                <h6>Loading...</h6> :
                <>
                    {(bookingHistory.length === 0) ?
                        <h6>You have no bookings.</h6> :
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
                                        <tr>
                                            <td><b>Scooter ID:</b></td>
                                            <td>{booking.scooterId}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Hire Option:</b></td>
                                            <td>{booking.hireOption.name}</td>
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
                                <br/>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>Booking ID</th>
                                        <th>Booking Details</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {bookingHistory.map((booking, idx) => (
                                        <tr key={idx}>
                                            <td>{booking.orderId}</td>
                                            <td><a onClick={() => {
                                                setBooking(bookingHistory[idx]);
                                                console.log(booking)
                                            }}
                                                   href="#/view-booking">View</a>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </div>
                        </>
                    }
                </>
            }
        </>
    );
};