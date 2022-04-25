import React, {useEffect, useState} from "react";
import {Button, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import orderState from "../staff/orderState";
import host from '../host';
import Cookies from 'universal-cookie';

export default function CustomerBookingHistory() {
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
            {(bookingHistory === '') ?
                <p>Loading booking history...</p> :
                <>
                    {(bookingHistory.length === 0) ?
                        <p>You have no bookings.</p> :
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
                                        {(booking.scooter) ?
                                            <tr>
                                                <td><b>Scooter ID:</b></td>
                                                <td>{booking.scooter.softScooterId}</td>
                                            </tr>
                                            :
                                            <tr>
                                                <td><b>Scooter:</b></td>
                                                <td>{booking.scooterId}</td>
                                            </tr>
                                        }
                                        <tr>
                                            <td><b>Customer ID:</b></td>
                                            <td>{booking.accountId}</td>
                                        </tr>
                                        {(booking.account) ?
                                            <>
                                                {(booking.account.depo) ?
                                                    <tr>
                                                        <td><b>Depot:</b></td>
                                                        <td>{booking.account.depo.name}</td>
                                                    </tr> : null
                                                }
                                            </>
                                            : null
                                        }
                                        <tr>
                                            <td><b>Hire Option:</b></td>
                                            <td>{booking.hireOption.name}</td>
                                        </tr>
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
                                    <Button className="float-end" onClick={() => setBooking("")}
                                            variant="danger">Close</Button>
                                </>
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
                                        <td>
                                            <Button onClick={() => setBooking(bookingHistory[idx])}>
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </>
                    }
                </>
            }
        </>
    );
};