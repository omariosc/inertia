import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {NotificationManager} from "react-notifications";
import getScooterName from "../../getScooterName";
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

    function validForm() {
        return validEmail && validConfirm && validPhoneNo && validScooter && validHireSlot && validCardNo && validExpDate && validCVV;
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
        if (!validForm()) {
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
                NotificationManager.success("Created guest booking.", "Success");
            } else if (response.status === 422) {
                NotificationManager.error("Scooter is currently unavailable.", "Error");
            } else {
                NotificationManager.error("Could not create booking.", "Error");
            }
        } catch (e) {
            console.log(e);
        }
        await fetchAvailableScooters();
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home
                </a> > <a className="breadcrumb-list" href="/bookings">Bookings</a> > <b>
                <a className="breadcrumb-current" href="/create-guest-booking">Create Booking</a></b>
            </p>
            <h3 id="pageName">Create Booking</h3>
            <hr id="underline"/>
            <br/>
            <div className="autoScroll">
                <Container className="pb-4">
                    <Row>
                        <Col className="col-7">
                            <Container>
                                <Row>
                                    <Col>
                                        <h5>Customer Details</h5>
                                        <Container>
                                            <Row className="pb-2">
                                                <Col className="text-end align-self-center">Email Address</Col>
                                                <Col>
                                                    <Form.Control type="email" placeholder="name@example.com"
                                                                  isInvalid={!validEmail}
                                                                  onInput={e => setEmail(e.target.value)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        Invalid Email Address
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Row>
                                            <Row className="pb-2">
                                                <Col className="text-end align-self-center">Confirm Email Address</Col>
                                                <Col>
                                                    <Form.Control type="email" placeholder="name@example.com"
                                                                  isInvalid={!validConfirm}
                                                                  onInput={e => setConfirmEmail(e.target.value)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        Email Address Does Not Match
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Row>
                                            <Row className="pb-2">
                                                <Col className="text-end align-self-center">Phone Number</Col>
                                                <Col>
                                                    <Form.Control type="text" placeholder="01234567890"
                                                                  isInvalid={!validPhoneNo}
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
                                        <h5>Booking Details</h5>
                                        <Container>
                                            <Row className="pb-2">
                                                <Col className="text-end align-self-center">Scooter</Col>
                                                <Col>
                                                    {(map_locations === "" || scooters === "") ?
                                                        <label>Loading scooters...</label> :
                                                        <>
                                                            <Form.Select defaultValue="none" onChange={(e) => {
                                                                setScooterChoiceId(e.target.value);
                                                            }}
                                                                         isInvalid={!validScooter}>
                                                                <option value="none" key="none" disabled hidden>
                                                                    Select scooter
                                                                </option>
                                                                {scooters.map((scooter, idx) => (
                                                                    <option value={scooter.scooterId}
                                                                            key={idx}>{getScooterName(idx, scooters, map_locations)}</option>
                                                                ))}
                                                            </Form.Select>
                                                            <div className="invalid-feedback">Please select option</div>
                                                        </>
                                                    }
                                                </Col>
                                            </Row>
                                            <Row className="pb-2">
                                                <Col className="text-end align-self-center">Hire Period</Col>
                                                <Col>
                                                    {hireOptions === "" ?
                                                        <label>Loading hire periods...</label> :
                                                        <>
                                                            <Form.Select defaultValue="none" onChange={(e) => {
                                                                let value = e.target.value.split(',')
                                                                setHireChoiceId(value[0]);
                                                                setPrice(value[1])
                                                            }}
                                                                         isInvalid={!validHireSlot}>

                                                                <option value="none" key="none" disabled hidden>
                                                                    Select hire period
                                                                </option>
                                                                {hireOptions.map((option, idx) => (
                                                                    <option key={idx}
                                                                            value={[option.hireOptionId, option.cost]}>{option.name} -
                                                                        £{option.cost}</option>
                                                                ))}
                                                            </Form.Select>
                                                            <div className="invalid-feedback">
                                                                Please select option
                                                            </div>
                                                        </>
                                                    }
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <h5>Payment details</h5>
                                        <Container>
                                            {(isNaN(parseFloat(price))) ? null :
                                                <Row className="pb-2">
                                                    <Col className="text-end align-self-center">Cost</Col>
                                                    <Col>
                                                        <>£{parseFloat(price).toFixed(2)}</>
                                                    </Col>
                                                </Row>
                                            }
                                            <Row className="pb-2">
                                                <Col className="text-end align-self-center">Card Number</Col>
                                                <Col>
                                                    <Form.Control type="text" placeholder="4000-1234-5678-9010"
                                                                  isInvalid={!validCardNo}
                                                                  onInput={(e) => setCardNo(e.target.value)}/>
                                                    <Form.Control.Feedback type="invalid">
                                                        Invalid Card Number
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Row>
                                            <Row className="pb-2">
                                                <Col className="text-end align-self-center">Expiry Date</Col>
                                                <Col>
                                                    <Form.Control type="text" placeholder="MM/YY"
                                                                  isInvalid={!validExpDate}
                                                                  onInput={(e) => setExpiry(e.target.value)}/>
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
                                                    <Form.Control type="text" placeholder="123" isInvalid={!validCVV}
                                                                  onInput={(e) => setCVV(e.target.value)}/>
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
                            {(map_locations === "") ? <h5>Loading map locations...</h5> :
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
                            }
                        </Col>
                    </Row>
                    <Button onClick={createGuestBooking}>Confirm Booking</Button>
                </Container>
            </div>
        </>
    );
};