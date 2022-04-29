import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Container, Table} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import Cookies from 'universal-cookie';
import host from "../host";
import showDate from "../showDate";
import orderState from "../staff/orderState";

export default function CustomerCancelBooking() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const {orderId} = useParams();
    const [booking, setBooking] = useState("");


    useEffect(() => {
        fetchOrderInfo();
    }, []);

    async function fetchOrderInfo() {
        try {
            let request = await fetch(host + `api/Orders/${orderId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let response = await request;
            if (response.status === 422) {
                NotificationManager.error("Cannot create extension from invalid booking ID.", "Error");
                navigate("../")
            } else if(response.status === 200){
                setBooking(await response.json());
            }
        } catch (error) {
            console.error(error);
        }
    }


    async function cancelBooking() {
        try {
            let request = await fetch(host + `api/Orders/${orderId}/cancel`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let response = await request;
            if (response.status === 422) {
                NotificationManager.error("Unable to cancel booking", "Error");
            } else if (response.status === 200) {
                NotificationManager.success("Booking Cancelled.", "Success");
                navigate('/current-bookings');
            }
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <Container>
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
                </>
            }




            <Button className="float-right"
                    onClick={cancelBooking}>Cancel Booking</Button>


        </Container>
    );
};