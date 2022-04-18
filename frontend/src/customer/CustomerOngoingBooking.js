import React, {useEffect, useState} from "react";
import {Form, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import host from "../host";
import Cookies from "universal-cookie";

export default function OngoingBookings() {
    const cookies = new Cookies();
    const [bookingHistory, setBookingHistory] = useState('');
    const [booking, setBooking] = useState('');
    const [hireOptions, setHireOptions] = useState('');
    const [hireChoiceId, setHireChoiceId] = useState('');
    const orderState = ["Cancelled", "Pending Approval", "Upcoming", "Ongoing", "Pending Return", "Completed", "Denied"];

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
            if (response.status === 200) {
                alert("Extended booking.");
            } else {
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
            if (response.status === 200) {
                alert("Cancelled booking.");
            } else {
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
            {(bookingHistory === '') ?
                <h6>Loading booking history...</h6> :
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
                                        <tr>
                                            <td><b>Discount:</b></td>
                                            <td>{booking.discount * 100}%</td>
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
                                        <th>Scooter ID</th>
                                        <th>Hire Length</th>
                                        <th>Time Expiring</th>
                                        <th>Extend</th>
                                        <th>Cancel</th>
                                        <th>Booking Confirmation</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {(bookingHistory === '') ?
                                        <h6>Loading bookings...</h6> :
                                        <>
                                            {bookingHistory.map((booking, idx) => (
                                                <tr key={idx}>
                                                    <td>{booking.scooterId}</td>
                                                    <td>{booking.hireOption.name}</td>
                                                    <td>{showDate(booking.endTime)}</td>
                                                    <td>
                                                        {(booking.orderState === 1) ? "N/A (Pending Approval)" :
                                                            <>
                                                                {(hireOptions === '') ?
                                                                    <h6>Loading hire options...</h6> :
                                                                    <Form.Select
                                                                        onChange={(e) => {
                                                                            setHireChoiceId(e.target.value);
                                                                        }}
                                                                    >
                                                                        <option value="none" key="none">Select a hire
                                                                            option slot...
                                                                        </option>
                                                                        {hireOptions.map((option, idx) => (
                                                                            <option key={idx}
                                                                                    value={option.hireOptionId}>{option.name} -
                                                                                £{option.cost}</option>
                                                                        ))}
                                                                    </Form.Select>
                                                                }
                                                                <a onClick={() => extendBooking(booking.orderId)}
                                                                   color="green"
                                                                   href="#/extend"
                                                                >Extend</a>
                                                            </>
                                                        }
                                                    </td>
                                                    <td>
                                                        {(booking.orderState === 2) ? "N/A (Booking is upcoming)" : null}
                                                        {(booking.orderState === 3) ? "N/A (Booking is ongoing)" : null}
                                                        {(booking.orderState !== 2 && booking.orderState !== 3) ?
                                                            <a onClick={() => cancelBooking(booking.orderId)}
                                                               color="red"
                                                               href="#/cancel"
                                                            >Cancel</a> : null
                                                        }
                                                    </td>
                                                    <td>
                                                        <a onClick={() => setBooking(bookingHistory[idx])}
                                                           href="#/view-booking">View</a></td>
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
        </>
    );
};