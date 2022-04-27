import React, {useEffect, useState} from "react";
import {Button, Container, Form, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {NotificationManager} from "react-notifications";
import showDate from "../../showDate";
import host from "../../host";
import Cookies from "universal-cookie";
import {useNavigate} from "react-router-dom";

export default function EmployeeOngoingBookings() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const [bookingHistory, setBookingHistory] = useState('');
    const [hireOptions, setHireOptions] = useState('');
    const [hireChoiceId, setHireChoiceId] = useState('');

    useEffect(() => {
        fetchBookings();
        fetchHirePeriods();
    }, []);

    async function fetchBookings() {
        try {
            let request = await fetch(host + `api/admin/Orders/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let allBookings = await request.json();
            setBookingHistory(allBookings.filter((booking) => {
                    if (booking.orderState >= 1 && booking.orderState <= 3) {
                        return booking;
                    }
                    return null;
                }
            ));
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
                NotificationManager.error("Could not extend booking.", "Error");
            } else {
                NotificationManager.success("Extended booking.", "Success");
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
                NotificationManager.error("Could not cancel booking.", "Error");
            } else {
                NotificationManager.success("Cancelled booking.", "Success");
            }
        } catch (e) {
            console.log(e);
        }
        await fetchBookings();
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home</a> > <b>
                <a className="breadcrumb-current" href="/bookings">Bookings</a></b>
            </p>
            <h3 id="pageName">Ongoing Bookings</h3>
            <hr id="underline"/>
            <br/>
            <Container>
                {(bookingHistory === '') ?
                    <p>Loading booking history...</p> :
                    <>
                        {(bookingHistory.length === 0) ?
                            <p>There are currently no ongoing bookings.</p> :
                            <>
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
                                                            <Form.Select defaultValue="none"
                                                                         onChange={(e) => {
                                                                             setHireChoiceId(e.target.value);
                                                                         }}
                                                            >
                                                                <option value="none" key="none" disabled hidden>
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
                                                        <Button onClick={() => navigate("../bookings/" + booking.orderId)}>
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
            </Container>
        </>
    );
};