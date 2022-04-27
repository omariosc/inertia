import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Cookies from "universal-cookie";
import host from "../../host";
import {NotificationManager} from "react-notifications";
import showDate from "../../showDate";
import orderState from "../orderState";
import {Container, Table} from "react-bootstrap";

export default function staffViewBooking() {
    let navigate = useNavigate();
    let {orderId} = useParams();
    const cookies = new Cookies();
    const [booking, setBooking] = useState("");

    useEffect(() => {
        fetchBookingDetails();
    }, []);

    // Gets the order details.
    async function fetchBookingDetails() {
        try {

            let request = await fetch(host + `api/admin/Orders/` + orderId, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let response = await request.json();
            if (response.errorCode) {
                NotificationManager.error("Invalid ID.", "Error");
                navigate('/bookings');
            } else {
                setBooking(response);
            }
        } catch (error) {
            NotificationManager.error("Could not load booking.", "Error");
            navigate('/bookings');
            console.error(error);
        }
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home
                </a> > <a className="breadcrumb-list" href="/bookings">Bookings</a> > <b>
                <a className="breadcrumb-current" href={`/bookings/${orderId}`}>#{orderId}</a></b>
            </p>
            <Container>
                {(booking === "") ? <p>Loading booking details...</p> :
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
            </Container>
        </>
    );
}


