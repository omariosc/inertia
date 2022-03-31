import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import validateCard from "./cardValidator";
import host from "./host";
import center from "./center";
import Cookies from "universal-cookie";
import './StaffInterface.css';

export default function CreateBooking({map_locations}) {
    const cookies = new Cookies();
    const [scooters, setScooters] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [hireOptions, setHireOptions] = useState('');
    const [hireChoiceId, setHireChoiceId] = useState('');
    const [price, setPrice] = useState('');
    const [scooterChoiceId, setScooterChoiceId] = useState('');
    const [cardNo, setCardNo] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCVV] = useState('');

    useEffect(() => {
        fetchAvailableScooters();
        fetchHirePeriods();
    }, []);

    async function fetchAvailableScooters() {
        try {
            let request = await fetch(host + "api/Scooters/available", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            setScooters(await request.json());
        } catch (error) {
            console.error(error);
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

    async function createGuestBooking() {
        if (email !== confirmEmail) {
            alert("Customer email and confirm email addresses do not match.");
            return;
        }
        if (!(email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))) {
            alert("Email address is invalid.");
            return;
        }
        if (!(phoneNo.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/))) {
            alert("Phone number is invalid.");
            return;
        }
        if (!validateCard(cardNo, expiry, cvv)) {
            return;
        }
        if (scooterChoiceId === '' || scooterChoiceId === 'none') {
            alert("Select a scooter.");
            return;
        }
        if (hireChoiceId === '' || hireChoiceId === 'none') {
            alert("Select a hire option.");
            return;
        }
        try {
            let request = await fetch(host + "api/admin/Orders/CreateGuestOrder", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    "email": email,
                    "phoneNumber": phoneNo,
                    "hireOptionId": parseInt(hireChoiceId),
                    "scooterId": parseInt(scooterChoiceId),
                    "startTime": new Date(Date.now()).toISOString()
                }),
                mode: "cors"
            });
            let response = await request;
            if (response.status === 200) {
                alert("Created guest booking.");
            } else if (response.status === 422) {
                alert("Scooter is currently unavailable.");
            } else {
                alert("Could not create booking.");
            }
        } catch (e) {
            console.log(e);
        }
        await fetchAvailableScooters();
    }

    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Create Booking</h1>
            <br/>
            <Container>
                <Row>
                    <Col xs={3}>
                        <h3>Enter Customer Details</h3>
                        <br/>
                        <Form>
                            <Form.Group>
                                <Form.Label><b>Customer Email Address</b></Form.Label>
                                <Form.Control type="email" placeholder="Enter customer email address"
                                              onInput={e => setEmail(e.target.value)}/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Confirm Customer Email Address</b></Form.Label>
                                <Form.Control type="email" placeholder="Confirm customer email address"
                                              onInput={e => setConfirmEmail(e.target.value)}/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Customer Phone Number</b></Form.Label>
                                <Form.Control type="text" placeholder="Enter customer phone number"
                                              onInput={e => setPhoneNo(e.target.value)}/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Card Number</b></Form.Label>
                                <Form.Control type="text" placeholder="Enter customer card number"
                                              onInput={e => setCardNo(e.target.value)}/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Expiry Date</b></Form.Label>
                                <Form.Control type="text" placeholder="Enter customer card expiry date"
                                              onInput={e => setExpiry(e.target.value)}/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>CVV</b></Form.Label>
                                <Form.Control type="text" placeholder="Enter customer card cvv code"
                                              onInput={e => setCVV(e.target.value)}/>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xs={1}/>
                    <Col xs={3}>
                        <h3>Enter Booking Details</h3>
                        <br/>
                        <Form>
                            <Form.Group>
                                <Form.Label><b>Select Scooter</b></Form.Label>
                                {(scooters === '') ?
                                    <h6>Loading...</h6> :
                                    <Form.Select
                                        onChange={(e) => {
                                            setScooterChoiceId(e.target.value);
                                        }}
                                    >
                                        <option value="none" key="none">Select a scooter...</option>
                                        {scooters.map((scooter, idx) => (
                                            <option value={scooter.scooterId} key={idx}>
                                                Scooter {scooter.softScooterId} ({String.fromCharCode(parseInt(scooter.depoId + 64))} - {map_locations[scooter.depoId - 1].name})</option>
                                        ))}
                                    </Form.Select>
                                }
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Select Hire Period</b></Form.Label>
                                {(hireOptions === '') ?
                                    <h6>Loading...</h6> :
                                    <Form.Select
                                        onChange={(e) => {
                                            let value = e.target.value.split(',')
                                            setHireChoiceId(value[0]);
                                            setPrice(value[1])
                                        }}
                                    >
                                        <option value="none" key="none">Select a hire option slot...</option>
                                        {hireOptions.map((option, idx) => (
                                            <option key={idx} value={[option.hireOptionId, option.cost]}>{option.name} -
                                                £{option.cost}</option>
                                        ))}
                                    </Form.Select>
                                }
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                {(isNaN(parseFloat(price))) ? null :
                                    <Form.Label><b>Total Cost: £{parseFloat(price).toFixed(2)}</b></Form.Label>
                                }
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Button style={{float: "right"}} onClick={createGuestBooking}>Confirm Booking</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xs={1}/>
                    <Col xs={4}>
                        <MapContainer center={center} zoom={15} zoomControl={false} className="minimap">
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            {map_locations.map((map_location, index) => (
                                <Marker key={index} position={[map_location.latitude, map_location.longitude]}>
                                    <Popup>{map_location.name}</Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </Col>
                </Row>
            </Container>
        </>
    );
};