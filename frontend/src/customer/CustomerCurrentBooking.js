import React, {useEffect, useState} from "react";
import {Button, Form, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import orderState from "../staff/orderState";
import host from "../host";
import Cookies from "universal-cookie";
import showDate from "../showDate";

export default function CustomerCurrentBookings() {
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
            let request = await fetch(host + `api/Orders/${id}/extend`, {
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
            let request = await fetch(host + `api/Orders/${id}/cancel`, {
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
                                    <Button className="float-right" onClick={() => setBooking("")}
                                            variant="danger">Close</Button>
                                </>
                            }
                            <Table>
                                <thead>
                                <tr>
                                    <th>Hire Length</th>
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
                                                <td>{booking.hireOption.name}</td>
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
                                                    <Button onClick={() => extendBooking(booking.orderId)}
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
                        </>
                    }
                </>
            }
        </>
    );
};