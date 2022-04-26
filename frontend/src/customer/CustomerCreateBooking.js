import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {NotificationManager} from "react-notifications";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import getScooterName from "../getScooterName";
import center from "../center";
import host from "../host";
import moment from "moment";
import Cookies from 'universal-cookie';

export default function CustomerCreateBooking() {
    const cookies = new Cookies();
    let navigate = useNavigate();
    const [map_locations, setMapLocations] = useState('');
    const [scooters, setScooters] = useState('');
    const [hireOptions, setHireOptions] = useState('');
    const [scooterChoiceId, setScooterChoiceId] = useState('');
    const [hireChoiceId, setHireChoiceId] = useState('');
    const [price, setPrice] = useState('');
    const [cardNo, setCardNo] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCVV] = useState('');
    const [validScooter, setValidScooter] = useState(true);
    const [validHireSlot, setValidHireSlot] = useState(true);
    const [validCardNo, setValidCardNo] = useState(true);
    const [validExpDate, setValidExpDate] = useState(true);
    const [validCVV, setValidCVV] = useState(true);
    const [discount, setDiscount] = useState(false);
    const [discountType, setDiscountType] = useState('');
    const [loading, setLoading] = useState('');

    useEffect(() => {
        fetchAvailableScooters();
        fetchHirePeriods();
        fetchDiscountStatus();
        fetchLocations();
    }, []);

    async function fetchLocations() {
        try {
            let request = await fetch(host + "api/Depos", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                mode: "cors"
            });
            setMapLocations(await request.json());
        } catch (e) {
            console.log(e);
        }
    }

    async function getDiscountStatus() {
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
            let response = await request.json();
            let thresholdDate = moment().subtract(1, 'week').toISOString()
            let recentBookings = response.filter(e => e.createdAt >= thresholdDate);
            let recentHours = 0;
            for (let i = 0; i < recentBookings.length; i++) {
                recentHours += recentBookings[i].hireOption.durationInHours;
                if (recentBookings[i]["extensions"] != null) {
                    for (let j = 0; j < recentBookings[i]["extensions"].length; j++) {
                        recentHours += recentBookings[i]["extensions"][j].hireOption.durationInHours;
                    }
                }
            }
            if (recentHours >= 8) {
                setDiscount(true);
                setDiscountType("Frequent User");
            }
        } catch (e) {
            console.log(e);
        }
    }

    async function fetchDiscountStatus() {
        try {
            let request = await fetch(host + `api/Users/${cookies.get('accountID')}/profile`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let response = await request.json();
            if (response.userType === 0) {
                setDiscount(true);
                setDiscountType("Student");
            } else if (response.userType === 1) {
                setDiscount(true);
                setDiscountType("Senior");
            } else {
                await getDiscountStatus();
            }
            setLoading('complete');
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

    function validChoice() {
        return validScooter && validHireSlot;
    }

    function validCard() {
        return validCardNo && validExpDate && validCVV;
    }

    async function createBooking() {
        setValidScooter(scooterChoiceId !== '' && scooterChoiceId !== 'none');
        setValidHireSlot(hireChoiceId !== '' && hireChoiceId !== 'none');
        if (!validChoice()) {
            return;
        }
        if (!checkCardExists()) {
            setValidCardNo(cardNo.length > 9 && cardNo.length < 20);
            setValidExpDate(expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/));
            setValidCVV(cvv.match(/^[0-9]{3,4}$/));
            if (!validCard()) {
                return;
            }
        }
        try {
            let request = await fetch(host + "api/Orders", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    'hireOptionId': parseInt(hireChoiceId),
                    'scooterId': parseInt(scooterChoiceId),
                    'startTime': new Date(Date.now()).toISOString()
                }),
                mode: "cors"
            });
            let response = await request;
            if (response.status === 422) {
                NotificationManager.error("Scooter is currently unavailable.", "Error");
            } else if (response.status === 200) {
                NotificationManager.success("Created Booking.", "Success");
                if (!checkCardExists()) {
                    cookies.set('cardNumber', cardNo, {path: '/'});
                    cookies.set('expiryDate', expiry, {path: '/'});
                    cookies.set('cvv', cvv, {path: '/'});
                    NotificationManager.success("Stored credit card details.", "Success");
                }
                navigate('/current-bookings');
            }
        } catch (error) {
            console.error(error);
        }
    }

    function checkCardExists() {
        return (cookies.get('cardNumber') && cookies.get('expiryDate') && cookies.get('cvv'));
    }

    function DisplayCost() {
        return (
            (isNaN(parseFloat(price))) ? null :
                (loading === '') ? null :
                    (discount) ?
                        <Row className="pb-2 input">
                            <label>Cost</label>
                            <Col>
                                {(hireChoiceId === '') ? null :
                                    `£${(0.9 * parseFloat(price)).toFixed(2)} (10% ${discountType} Discount applied)`
                                }
                            </Col>
                        </Row> :
                        <Row className="pb-2 input">
                            <label>Cost</label>
                            <Col>
                                {(hireChoiceId === '') ? null :
                                    `£${parseFloat(price).toFixed(2)}`
                                }
                            </Col>
                        </Row>
        )
    }

    return (
        <Container>
            <h5>Booking Details</h5>
            <br/>
            <Row className="pb-2 input">
                <label>Scooter</label>
                {(map_locations === "" || scooters === "") ? <label>Loading scooters...</label> :
                    <Form.Select defaultValue="none" isInvalid={!validScooter} onChange={(e) => {
                        setScooterChoiceId(e.target.value);
                    }}>
                        <option value="none" key="none" disabled hidden>Select scooter</option>
                        {scooters.map((scooter, idx) => (
                            <option value={scooters[idx].scooterId}
                                    key={idx}>{getScooterName(idx, scooters, map_locations)}</option>
                        ))}
                    </Form.Select>
                }
            </Row>
            <Row className="pb-2 input">
                <label>Hire Period</label>
                {(hireOptions === "") ? <label>Loading hire periods...</label> : <>
                    <Form.Select isInvalid={!validHireSlot} defaultValue="none" onChange={(e) => {
                        let value = e.target.value.split(',')
                        setHireChoiceId(value[0]);
                        setPrice(value[1])
                    }}>

                        <option value="none" key="none" disabled hidden>Select hire period</option>
                        {hireOptions.map((option, idx) => (
                            <option key={idx} value={[option.hireOptionId, option.cost]}>{option.name} -
                                £{option.cost}</option>
                        ))}
                    </Form.Select>
                </>
                }
            </Row>
            <br/>
            <Row>
                {(map_locations === "") ? <h5>Loading map locations...</h5> :
                    <MapContainer center={center} zoom={15} zoomControl={false} className="minimap-customer">
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        {map_locations.map((map_location, index) => (
                            <Marker key={index} position={[map_location.latitude, map_location.longitude]}>
                                <Popup>{map_location.name}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                }
            </Row>
            <br/>
            {!checkCardExists() ?
                <>
                    <h5>Payment details</h5>
                    <br/>
                    <DisplayCost/>
                    <Row className="pb-2 input small-padding-top">
                        <label>Card Number</label>
                        <Col>
                            <Form.Control type="text" placeholder="4000-1234-5678-9010"
                                          isInvalid={!validCardNo}
                                          onInput={e => setCardNo(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">
                                Invalid Card Number
                            </Form.Control.Feedback>
                        </Col>
                    </Row>
                    <Row className="pb-2 input">
                        <label>Expiry Date</label>
                        <Col>
                            <Form.Control type="text" placeholder="MM/YY"
                                          isInvalid={!validExpDate}
                                          onInput={e => setExpiry(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">
                                Invalid Expiry Date
                            </Form.Control.Feedback>
                        </Col>
                    </Row>
                    <Row className="pb-2 input">
                        <label>CVV</label>
                        <Col>
                            <Form.Control type="text" placeholder="123"
                                          isInvalid={!validCVV}
                                          onInput={e => setCVV(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">
                                Invalid CVV
                            </Form.Control.Feedback>
                        </Col>
                    </Row>
                </> : <>
                    <h5>Using stored payment details</h5>
                    <br/>
                    <DisplayCost/>
                    <Row className="pb-2 input">
                        <label>Card Number</label>
                        <Col>**** ****
                            **** {cookies.get('cardNumber').slice(cookies.get('cardNumber').length - 4)}</Col>
                    </Row>
                    <Row className="pb-2 input">
                        <label>Expiry Date</label>
                        <Col>{cookies.get('expiryDate')}</Col>
                    </Row>
                    <br/>
                    {checkCardExists() ?
                        <Button variant="danger" onClick={() => {
                            cookies.remove('cardNumber');
                            cookies.remove('expiryDate');
                            cookies.remove('cvv');
                            navigate('/create-booking');
                            NotificationManager.success("Deleted credit card details.", "Sucess");
                        }}>Delete card</Button> : null
                    }
                    <br/>
                </>
            }
            <br/>
            <Button onClick={createBooking}>Confirm Booking</Button>
        </Container>
    );
};