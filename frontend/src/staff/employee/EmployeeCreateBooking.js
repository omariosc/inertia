import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import validateCard from "../../cardValidator";
import center from "../../center";
import host from "../../host";
import Cookies from "universal-cookie";

export default function EmployeeCreateGuestBooking() {
    const cookies = new Cookies();
    const [map_locations, setMapLocations] = useState('');
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
    const [validEmail, setValidEmail] = useState(true);
    const [validConfirm, setValidConfirm] = useState(true);
    const [validPhoneNo, setValidPhoneNo] = useState(true);
    const [validScooter, setValidScooter] = useState(true);
    const [validHireSlot, setValidHireSlot] = useState(true);
    const [validCardNo, setValidCardNo] = useState(true);
    const [validExpDate, setValidExpDate] = useState(true);
    const [validCVV, setValidCVV] = useState(true);

    useEffect(() => {
        fetchAvailableScooters();
        fetchHirePeriods();
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
        setValidEmail((email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)));
        setValidConfirm(email === confirmEmail);
        setValidPhoneNo(phoneNo.match(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/));
        setValidScooter(scooterChoiceId !== '' && scooterChoiceId !== 'none');
        setValidHireSlot(hireChoiceId !== '' && hireChoiceId !== 'none');
        setValidCardNo(cardNo.length > 9 && cardNo.length < 20);
        setValidExpDate(expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/));
        setValidCVV(cvv.match(/^[0-9]{3,4}$/));
        if (!(validEmail && validConfirm && validPhoneNo && validScooter && validHireSlot && validCardNo && validExpDate && validCVV)) {
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
            window.reload()
        } catch (e) {
            console.log(e);
        }
        await fetchAvailableScooters();
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home
                </a> > <a className="breadcrumb-list" href="/create-guest-booking">Bookings</a> > <b>
                <a className="breadcrumb-current" href="/create-guest-booking">Create Booking</a></b>
            </p>
            <hr/>
            <div className="autoScroll">
                <h1>Create Booking</h1>
                <Container className="pb-4">
                    <Row>
                        <Col className="col-7">
                            <Container>
                                <Row>
                                    <Col>
                                        <strong> Customer Details </strong>
                                        <Container>
                                            <Row className="pb-2">
                                                <Col className="text-end align-self-center">
                                                    Email Address
                                                </Col>
                                                <Col>
                                                    <Form.Control type="email"
                                                                  isInvalid={!validEmail}
                                                                  placeholder="username@mail.com"
                                                                  onInput={e => setEmail(e.target.value)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        Invalid Email Address
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Row>
                                            <Row className="pb-2">
                                                <Col className="text-end align-self-center">
                                                    Confirm Email Address
                                                </Col>
                                                <Col>
                                                    <Form.Control type="email"
                                                                  isInvalid={!validConfirm}
                                                                  placeholder="username@mail.com"
                                                                  onInput={e => setConfirmEmail(e.target.value)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        Please Repeat Email Address
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Row>
                                            <Row className="pb-2">
                                                <Col className="text-end align-self-center">
                                                    Phone Number
                                                </Col>
                                                <Col>
                                                    <Form.Control type="text"
                                                                  isInvalid={!validPhoneNo}
                                                                  placeholder="000000000000"
                                                                  onInput={e => setPhoneNo(e.target.value)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        Invalid Phone Number
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <strong> Booking Details </strong>
                                        <Container>
                                            <Row className="pb-2">
                                                <Col className="text-end align-self-center">
                                                    Select Scooter
                                                </Col>
                                                <Col>
                                                    {map_locations === "" || scooters === "" ?
                                                        <Form.Control type="plaintext" value="Loading Scooters..."/> :
                                                        <>
                                                            <Form.Select onChange={(e) => {
                                                                setScooterChoiceId(e.target.value);
                                                            }}
                                                                         isInvalid={!validScooter}>
                                                                <Form.Control.Feedback type="invalid">
                                                                    Please provide a valid email
                                                                </Form.Control.Feedback>
                                                                <option value="none" key="none" selected disabled
                                                                        hidden>
                                                                    Select a scooter...
                                                                </option>
                                                                {scooters.map((scooter, idx) => (
                                                                    <option value={scooter.scooterId} key={idx}>
                                                                        Scooter {scooter.softScooterId} ({String.fromCharCode(parseInt(scooter.depoId + 64))} - {map_locations[scooter.depoId - 1].name})</option>
                                                                ))}
                                                            </Form.Select>
                                                            <div className={"invalid-feedback"}>
                                                                Please select option
                                                            </div>
                                                        </>}
                                                </Col>
                                            </Row>
                                            <Row className="pb-2">
                                                <Col className="text-end align-self-center">
                                                    Select Hire Period
                                                </Col>
                                                <Col>
                                                    {hireOptions === "" ?
                                                        <Form.Control type="plaintext"
                                                                      value="Loading Hire Options..."/> :
                                                        <>
                                                            <Form.Select onChange={(e) => {
                                                                let value = e.target.value.split(',')
                                                                setHireChoiceId(value[0]);
                                                                setPrice(value[1])
                                                            }}
                                                                         isInvalid={!validHireSlot}>

                                                                <option value="none" key="none" selected disabled
                                                                        hidden>
                                                                    Select a hire option slot...
                                                                </option>
                                                                {hireOptions.map((option, idx) => (
                                                                    <option key={idx}
                                                                            value={[option.hireOptionId, option.cost]}>{option.name} -
                                                                        £{option.cost}</option>
                                                                ))}
                                                            </Form.Select>
                                                            <div className={"invalid-feedback"}>
                                                                Please select option
                                                            </div>
                                                        </>}
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <strong> Payment details </strong>
                                        <Container>
                                            <Row className="pb-2">
                                                <Col className="text-end align-self-center">
                                                    Card Number
                                                </Col>
                                                <Col>
                                                    <Form.Control type="text" placeholder="0000-0000-0000-0000"
                                                                  isInvalid={!validCardNo}
                                                                  onInput={e => setCardNo(e.target.value)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        Invalid Card Number
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Row>
                                            <Row className="pb-2">
                                                <Col className="text-end align-self-center">
                                                    Expiry Date
                                                </Col>
                                                <Col>
                                                    <Form.Control type="text" placeholder="MM/YY"
                                                                  isInvalid={!validExpDate}
                                                                  onInput={e => setExpiry(e.target.value)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        Invalid Expiry Date
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Row>
                                            <Row className="pb-2">
                                                <Col className="text-end align-self-center">
                                                    CVV
                                                </Col>
                                                <Col>
                                                    <Form.Control type="text" placeholder="000"
                                                                  isInvalid={!validCVV}
                                                                  onInput={e => setCVV(e.target.value)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        Invalid CVV
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                        <Col className="col-5">
                            {(map_locations === "") ?
                                <h5>Loading map locations...</h5> :
                                <MapContainer center={center} zoom={15} zoomControl={false} className="minimap">
                                    <TileLayer
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                                    {map_locations.map((map_location, index) => (
                                        <Marker key={index} position={[map_location.latitude, map_location.longitude]}>
                                            <Popup>{map_location.name}</Popup>
                                        </Marker>))}
                                </MapContainer>
                            }
                        </Col>
                    </Row>
                </Container>
                <div className="d-flex justify-content-center">
                    <Button onClick={createGuestBooking}>Confirm Booking</Button>
                </div>
            </div>
        </>
    );
};