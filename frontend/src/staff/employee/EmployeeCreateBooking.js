import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {NotificationManager} from "react-notifications";
import Cookies from "universal-cookie";
import getScooterName from "../../getScooterName";
import host from "../../host";
import getMapName from "../../getMapName";

export default function EmployeeCreateGuestBooking() {
    const cookies = new Cookies();
    const [map_locations, setMapLocations] = useState('');
    const [scooters, setScooters] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [hireOptions, setHireOptions] = useState('');
    const [hireChoiceId, setHireChoiceId] = useState('');
    const [price, setPrice] = useState('');
    const [depotChoiceId, setDepotChoiceId] = useState('')
    const [scooterChoiceId, setScooterChoiceId] = useState('');
    const [cardNo, setCardNo] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCVV] = useState('');
    const [validName, setValidName] = useState(true);
    const [validEmail, setValidEmail] = useState(true);
    const [validConfirm, setValidConfirm] = useState(true);
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
            setScooters((await request.json()).sort((a, b) => a.softScooterId - b.softScooterId));
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
            setHireOptions((await request.json()).sort((a, b) => a.cost - b.cost));
        } catch (error) {
            console.error(error);
        }
    }

    // Done like this because it setState is asynchronous
    function validate(){
        setValidName(name.length > 0);
        setValidEmail((email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)));
        setValidConfirm(email === confirmEmail);
        setValidScooter(scooterChoiceId !== '' && scooterChoiceId !== 'none');
        setValidHireSlot(hireChoiceId !== '' && hireChoiceId !== 'none');
        setValidCardNo(cardNo.length > 9 && cardNo.length < 20);
        setValidExpDate(expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/));
        setValidCVV(cvv.match(/^[0-9]{3,4}$/));
        return (name.length > 0)
            && ((email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)))
            && (email === confirmEmail)
            && (scooterChoiceId !== '' && scooterChoiceId !== 'none')
            && (hireChoiceId !== '' && hireChoiceId !== 'none')
            && (cardNo.length > 9 && cardNo.length < 20)
            && (expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/))
            && (cvv.match(/^[0-9]{3,4}$/));
    }

    async function createGuestBooking() {
        if (!validate()) {
            NotificationManager.error("Invalid details provided", "Error");
        } else {
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
                        "name": name,
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
                    let message = await response.json();
                    if (message.errorCode === 10) {
                        NotificationManager.error("Email provided is already associated with an account.", "Error");
                    } else {
                        NotificationManager.error("Scooter is currently unavailable.", "Error");
                    }
                } else {
                    NotificationManager.error("Could not create booking.", "Error");
                }
            } catch (e) {
                console.log(e);
            }
            await fetchAvailableScooters();
        }
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/home">Home
                </a> > <a className="breadcrumb-list" href="/bookings">Bookings</a> > <b>
                <a className="breadcrumb-current" href="/create-guest-booking">Create Booking</a></b>
            </p>
            <h3 id="pageName">Create Booking</h3>
            <hr id="underline"/>
            <Container className="pb-4">
                <Row>
                    <Col className="col-6">
                        <Container className="autoScrollSub">
                            <h5>Customer Details</h5>
                            <Row className="pb-2 small-padding-top">
                                <Col className="text-end col-6 align-self-center">
                                    Name:
                                </Col>
                                <Col className="text-end">
                                    <Form.Control type="text" placeholder="John Smith"
                                                  isInvalid={!validName}
                                                  onInput={e => setName(e.target.value)}/>
                                    <Form.Control.Feedback type="invalid">
                                        Enter Customer Name
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                            <Row className="pb-2">
                                <Col className="text-end align-self-center">
                                    Email Address:
                                </Col>
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
                            <h5>Booking Details</h5>
                            <Row className="pb-2">
                                <Col className="text-end col-6 align-self-center">
                                    Depot:
                                </Col>
                                <Col>
                                    {(map_locations === "") ? <> Loading depots... </> :
                                        <Form.Select value={depotChoiceId}
                                                     isInvalid={!validScooter} onChange={(e) => {
                                            setDepotChoiceId(e.target.value);
                                            setScooterChoiceId("");
                                        }}>
                                            <option value="" key="none" disabled hidden>Select Depot</option>
                                            {map_locations.map((depot, idx) => (
                                                <option value={depot.depoId}
                                                        key={idx}>{depot.name}</option>
                                            ))}
                                        </Form.Select>
                                    }
                                </Col>
                            </Row>
                            <Row className="pb-2">
                                <Col className="text-end col-6 align-self-center">
                                    Scooter:
                                </Col>
                                <Col>
                                    {(scooters === "") ? <> Loading scooters... </> :
                                        <Form.Select value={scooterChoiceId}
                                                     isInvalid={!validScooter}
                                                     disabled={depotChoiceId === ""}
                                                     onChange={(e) => {
                                                         setScooterChoiceId(e.target.value);
                                                     }}>
                                            {depotChoiceId === "" ?
                                                <option value="" key="none" disabled hidden>Select Depot
                                                    First</option> : <>
                                                    <option value="" key="none" disabled hidden>Select Scooter
                                                    </option>
                                                    {scooters.filter((scooter) => {
                                                        if (scooter.depoId.toString() === depotChoiceId.toString()) {
                                                            return scooter;
                                                        } else {
                                                            return null;
                                                        }
                                                    }).map((scooter, idx) => (
                                                        <option value={scooter.scooterId}
                                                                key={idx}>{scooter.softScooterId}</option>
                                                    ))}
                                                </>
                                            }

                                        </Form.Select>
                                    }
                                </Col>
                            </Row>
                            <Row className="pb-2">
                                <Col className="text-end col-6 align-self-center">
                                    Hire Period:
                                </Col>
                                <Col>
                                    {(hireOptions === "") ? <>Loading hire periods...</> : <>
                                        <Form.Select isInvalid={!validHireSlot} defaultValue="none"
                                                     onChange={(e) => {
                                                         let value = e.target.value.split(',')
                                                         setHireChoiceId(value[0]);
                                                         setPrice(value[1])
                                                     }}>

                                            <option value="none" key="none" disabled hidden>Select Hire Period
                                            </option>
                                            {hireOptions.map((option, idx) => (
                                                <option key={idx}
                                                        value={[option.hireOptionId, option.cost]}>{option.name} -
                                                    £{option.cost}</option>
                                            ))}
                                        </Form.Select>
                                    </>
                                    }
                                </Col>
                            </Row>
                            {price === "" ?
                                <h5>Cost: Unknown</h5>:
                                <h5>Cost: £{parseFloat(price).toFixed(2)}</h5>
                            }

                            <h5>Payment details</h5>
                            <Row className="pb-2 small-padding-top">
                                <Col className="text-end col-6 align-self-center">
                                    Card Number:
                                </Col>
                                <Col className="text-end">
                                    <Form.Control type="text" placeholder="4000-1234-5678-9010"
                                                  isInvalid={!validCardNo}
                                                  onInput={e => setCardNo(e.target.value)}/>
                                    <Form.Control.Feedback type="invalid">
                                        Invalid Card Number
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                            <Row className="pb-2">
                                <Col className="text-end col-6 align-self-center">
                                    Expiry Date:
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
                                <Col className="text-end col-6 align-self-center">
                                    CVV:
                                </Col>
                                <Col>
                                    <Form.Control type="text" placeholder="123"
                                                  isInvalid={!validCVV}
                                                  onInput={e => setCVV(e.target.value)}/>
                                    <Form.Control.Feedback type="invalid">
                                        Invalid CVV
                                    </Form.Control.Feedback>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col className="box" >
                        {(map_locations === "") ? <p>Loading map locations...</p> :
                            <MapContainer center={[map_locations[0].latitude, map_locations[0].longitude]} zoom={15}
                                          zoomControl={false} className="minimap-box">
                                <TileLayer
                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                                {map_locations.map((map_location, index) => (
                                    <Marker key={index}
                                            position={[map_location.latitude, map_location.longitude]}
                                            eventHandlers={{
                                                click: () => {
                                                    setDepotChoiceId(map_location.depoId);
                                                    setScooterChoiceId("");
                                                }
                                            }}>
                                        <Popup>
                                            <Button className="disabled">
                                                {map_location.name}
                                            </Button>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        }
                    </Col>
                </Row>
                <Button onClick={createGuestBooking}>Confirm Booking</Button>
            </Container>
        </>
    );
};