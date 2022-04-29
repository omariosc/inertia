import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Col, Container, Row, Table} from "react-bootstrap";
import Cookies from 'universal-cookie';
import host from '../../host';

export default function EmployeeBookingHistory() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        try {
            let request = await fetch(host + "api/admin/Orders/", {
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
                if (allBookings[i]['extensions'].length > 0) {
                    allBookings[i].endTime = allBookings[i]['extensions'][allBookings[i]['extensions'].length - 1].endTime;
                }
                ongoingBookings.push(allBookings[i]);
            }
            setBookings(ongoingBookings);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/home">Home
                </a> > <a className="breadcrumb-list" href="/bookings">Bookings</a> > <b>
                <a className="breadcrumb-current" href="/booking-history">Booking History</a></b>
            </p>
            <h3 id="pageName">Booking History</h3>
            <hr id="underline"/>
            <Container>
                {(bookings === '') ? <p>Loading bookings...</p> :
                    (bookings.length === 0) ? <p>There are no bookings.</p> :
                        <Row xs={1}>
                            <Col>
                                <Table className="table-formatting">
                                    <tbody>
                                    {bookings.map((booking, idx) => (
                                        <tr key={idx}>
                                            <td>{booking.orderId}</td>
                                            <td className="float-end">
                                                <Button onClick={() => navigate("../bookings/" + booking.orderId)}>
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                }
            </Container>
        </>
    );
};