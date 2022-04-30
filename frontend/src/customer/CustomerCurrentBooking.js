/*
	Purpose of file: Display a customer's current booking
	and allow them to cancel or extend it
*/

import React, {useEffect, useState} from "react";
import {Button, Table} from "react-bootstrap";
import Cookies from "universal-cookie";
import showDate from "../showDate";
import host from "../host";
import orderState from "../staff/orderState";
import {useNavigate} from "react-router-dom";

export default function CustomerCurrentBookings() {
    const cookies = new Cookies();
    const navigate = useNavigate();
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
            console.log(ongoingBookings);
            setBookingHistory(ongoingBookings);
        } catch (e) {
            console.log(e);
        }
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
                                <p>Select a booking to show booking details.</p> :
                                <>
                                    <Table className="table-formatting">
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
                            <Table className="table-formatting">
                                <thead>
                                <tr>
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
                                                <td>{showDate(booking.endTime)}</td>
                                                <td>
                                                    <Button onClick={() => navigate("/booking/extend/" + booking.orderId)}
                                                            variant="success">Extend</Button>
                                                </td>
                                                <td>
                                                    <Button onClick={() => navigate("/booking/cancel/" + booking.orderId)}
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
                        </>
                    }
                </>
            }
        </>
    );
};