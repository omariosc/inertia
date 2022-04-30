/*
	Purpose of file: Display a customer's booking history
	and information for each booking in a table
*/

import React, {useEffect, useState} from "react";
import {Button, Table} from "react-bootstrap";
import showDate from "../showDate";
import host from '../host';
import orderState from "../staff/orderState";
import {useAccount} from "../authorize";

/**
 * Returns the customer's booking history, a list of all previous
 * orders they have made
 */
export default function CustomerBookingHistory() {
    const [account] = useAccount();
    const [bookingHistory, setBookingHistory] = useState('');
    const [booking, setBooking] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

		/**
		 * Gets list of bookings from backend server
		 */
    async function fetchBookings() {
        try {
            let request = await fetch(host + `api/Users/${account.id}/orders`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                mode: "cors"
            });
            let allBookings = await request.json();
            let ongoingBookings = [];
            for (let i = 0; i < allBookings.length; i++) {
                if (allBookings[i]['extensions'].length > 0) {
                    allBookings[i].endTime = allBookings[i]['extensions'][allBookings[i]['extensions'].length - 1].endTime;
                }
                ongoingBookings.push(allBookings[i]);
            }
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
                            <Table className="table-formatting responsive-table">
                                <tbody>
                                {bookingHistory.map((booking, idx) => (
                                    <tr key={idx} className="minWidthFieldSmall">
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