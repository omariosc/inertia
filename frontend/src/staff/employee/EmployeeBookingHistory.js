import React, {useEffect, useState} from "react";
import {Button, Col, Container, Row, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import host from '../../host';
import Cookies from 'universal-cookie';
import {useNavigate} from "react-router-dom";

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
            setBookings(await request.json());
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home
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
                                            <td className={"float-end"}>
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