/*
	Purpose of file: Allow a staff member to create a booking
	for an unregistered user
*/

import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {NotificationManager} from "react-notifications";
import {useAccount} from '../../authorize';
import host from "../../host";

/**
 * Returns the employee create guest booking page which allows a staff
 * member to create a booking for an unregistered user
 */
export default function EmployeeCreateGuestBooking() {
    const [account] = useAccount();
    const navigate = useNavigate();
    const [map_locations, setMapLocations] = useState('');
    const [scooters, setScooters] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [hireOptions, setHireOptions] = useState('');
    const [hireChoiceId, setHireChoiceId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [price, setPrice] = useState('');
    const [depotChoiceId, setDepotChoiceId] = useState('')
    const [scooterChoiceId, setScooterChoiceId] = useState('');
    const [cardNo, setCardNo] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCVV] = useState('');
    const [validName, setValidName] = useState(true);
    const [validEmail, setValidEmail] = useState(true);
    const [validConfirm, setValidConfirm] = useState(true);
    const [validDepot, setValidDepot] = useState(true);
    const [validScooter, setValidScooter] = useState(true);
    const [validHireSlot, setValidHireSlot] = useState(true);
    const [validStartDate, setValidStartDate] = useState(true);
    const [validStartTime, setValidStartTime] = useState(true);
    const [validCardNo, setValidCardNo] = useState(true);
    const [validExpDate, setValidExpDate] = useState(true);
    const [validCVV, setValidCVV] = useState(true);

    useEffect(() => {
        fetchHirePeriods();
        fetchLocations();
    }, []);

    useEffect(() => {
        fetchAvailableScooters();

    }, [startTime, startDate, hireChoiceId, depotChoiceId]);

		/**
		 * Gets list of available locations from backend server
		 */
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

		/**
		 * Calculates the start time of the new booking
		 */
    function calcStartIso() {
        let hours = parseInt(startTime.slice(0, 2));
        let mins = parseInt(startTime.slice(3, 5));
        let bookingStart = new Date(startDate);
        bookingStart.setHours(hours, mins, 0, 0);
        return bookingStart.toISOString()
    }

		/**
		 * Calculates the end time of the new booking
		 */
    function calcEndIso() {
        let hours = parseInt(startTime.slice(0, 2));
        let mins = parseInt(startTime.slice(3, 5));
        let bookingEnd = new Date(startDate);
        let duration = hireOptions.find(x => x.hireOptionId === parseInt(hireChoiceId)).durationInHours;
        bookingEnd.setHours(hours + duration, mins, 0, 0);
        return bookingEnd.toISOString()
    }

		/**
		 * Gets list of available scooters for the order from the backend server
		 */
    async function fetchAvailableScooters() {
        let valid = true
        let validateFuncs = [validateTime, validateDate, validateDepot, validateHireSlot]
        validateFuncs.forEach((validateTerm) => {
            if (valid) {
                valid = validateTerm(false);
            } else {
                validateTerm(false);
            }
        })
        if (valid) {
            try {
                let requestString = host + "api/Scooters/available/" + "?depoId=" + depotChoiceId + "&startTime=" + calcStartIso() + "&endTime=" + calcEndIso()
                let request = await fetch(requestString, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${account.accessToken}`
                    },
                    mode: "cors"
                });
                setScooters((await request.json()).sort((a, b) => a.softScooterId - b.softScooterId));
            } catch (error) {
                console.error(error);
            }
        } else {
            setScooters("");
            setScooterChoiceId("");
        }
    }

		/**
		 * Gets list of available hire lengths for the order from the backend server
		 */
    async function fetchHirePeriods() {
        try {
            let request = await fetch(host + "api/HireOptions", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                mode: "cors"
            });
            setHireOptions((await request.json()).sort((a, b) => a.cost - b.cost));
        } catch (error) {
            console.error(error);
        }
    }

		/**
		 * Checks that the provided name for the order is valid
		 */
    function validateName(stateChange) {
        let valid = name.length > 0;
        if (stateChange) {
            setValidName(valid);
        }
        return valid;
    }

		/**
		 * Checks that the provided email for the order is valid
		 */
    function validateEmail(stateChange) {
        let valid = email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (stateChange) {
            setValidEmail(valid);
        }
        return valid;
    }

		/**
		 * Checks that the provided "confirm email" field for the order is valid
		 */
    function validateConfirm(stateChange) {
        let valid = email === confirmEmail;
        if (stateChange) {
            setValidConfirm(valid);
        }
        return valid;
    }

		/**
		 * Checks that the date of the new order is valid
		 */
    function validateDate(stateChange) {
        let currentDate = new Date();
        let dStartDate = new Date(startDate);
        currentDate.setHours(0, 0, 0, 0);
        dStartDate.setHours(0, 0, 0, 0);
        let valid = currentDate.toString() !== "Invalid Date" && currentDate <= dStartDate;
        if (stateChange) {
            setValidStartDate(valid);
        }
        return valid;
    }

		/**
		 * Checks that the time of the new order is valid
		 */
    function validateTime(stateChange) {
        let valid;
        if (startTime.length !== 5) {
            valid = false;
        } else {
            let hours = parseInt(startTime.slice(0, 2));
            let mins = parseInt(startTime.slice(3, 5));
            if (hours < 0 || hours > 23 || mins % 15 !== 0) {
                valid = false;
            } else {
                let currentDate = new Date();
                let dStartDate = new Date(startDate);
                currentDate.setSeconds(0, 0);
                dStartDate.setHours(hours, mins, 0, 0);
                valid = currentDate.toString() !== "Invalid Date" && currentDate <= dStartDate;
            }
        }
        if (stateChange) {
            setValidStartTime(valid);
        }
        return valid;
    }

		/**
		 * Checks that the depot of the new order is valid
		 */
    function validateDepot(stateChange) {
        let valid = depotChoiceId !== '' && depotChoiceId !== 'none';
        if (stateChange) {
            setValidDepot(valid);
        }
        return valid;
    }

		/**
		 * Checks that the chosen scooter for the new order is valid
		 */
    function validateScooter(stateChange) {
        let valid = scooterChoiceId !== '' && scooterChoiceId !== 'none';
        if (stateChange) {
            setValidScooter(valid);
        }
        return valid;
    }

		/**
		 * Checks that the hiring length of the order is valid
		 */
    function validateHireSlot(stateChange) {
        let valid = hireChoiceId !== '' && hireChoiceId !== 'none';
        if (stateChange) {
            setValidHireSlot(valid);
        }
        return valid;
    }

		/**
		 * Checks that the card number of the new order is valid
		 */
    function validateCardNo(stateChange) {
        let valid = cardNo.length > 9 && cardNo.length < 20;
        if (stateChange) {
            setValidCardNo(valid);
        }
        return valid;
    }

		/**
		 * Checks that the expiry date of the card of the new order is valid
		 */
    function validateExpDate(stateChange) {
        let valid = expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/);
        if (stateChange) {
            setValidExpDate(valid);
        }
        return valid;
    }

		/**
		 * Checks that the CVV of the card of the new order is valid
		 */
    function validateCVV(stateChange) {
        let valid = cvv.match(/^[0-9]{3,4}$/);
        if (stateChange) {
            setValidCVV(valid);
        }
        return valid;
    }


		/**
		 * If all validations are passed and booking can be made, creates the booking
		 * and updates the backend server
		 */
    async function createGuestBooking() {
        let valid = true
        let validateFuncs = [validateName, validateEmail, validateConfirm, validateTime, validateDate, validateDepot, validateScooter, validateHireSlot, validateCardNo, validateCVV, validateExpDate]
        validateFuncs.forEach((validateTerm) => {
            if (valid) {
                valid = validateTerm(true);
            } else {
                validateTerm(true);
            }

        })
        if (!valid) {
            NotificationManager.error("Invalid Details Provided", "Error");
        } else {
            try {
                let request = await fetch(host + "api/admin/Orders/CreateGuestOrder", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${account.accessToken}`
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
                    navigate('/bookings')
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
                <a className="breadcrumb-list" onClick={() => {navigate("/home")}}>Home
                </a> &gt; <a className="breadcrumb-list" onClick={() => {navigate("/bookings")}}>Bookings</a> &gt; <b>
                <a className="breadcrumb-current" onClick={() => {navigate("/create-guest-booking")}}>Create Booking</a></b>
            </p>
            <h3 id="pageName">Create Booking</h3>
            <hr id="underline"/>
            <Container className="pb-4">
                <div className="booking-responsive">
                    <Row>
                        <Col className="col-6">
                            <Container className="autoScrollSub">
                                <h5>Customer Details</h5>
                                <Row className="pb-2 small-padding-top">
                                    <Col className="col-5 text-end align-self-center">
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
                                    <Col className="col-5 text-end align-self-center">
                                        Email Address:
                                    </Col>
                                    <Col className="text-end">
                                        <Form.Control type="email" placeholder="name@example.com"
                                                      isInvalid={!validEmail}
                                                      onInput={e => setEmail(e.target.value)}/>
                                        <Form.Control.Feedback type="invalid">
                                            Invalid Email Address
                                        </Form.Control.Feedback>
                                    </Col>
                                </Row>
                                <Row className="pb-2">
                                    <Col className="col-5 text-end align-self-center">Confirm Email Address</Col>
                                    <Col className="text-end">
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
                                    <Col className="col-5 text-end align-self-center">
                                        Depot:
                                    </Col>
                                    <Col>
                                        {(map_locations === "") ? <> Loading depots... </> :
                                            <Form.Select value={depotChoiceId} isInvalid={!validDepot}
                                                         onChange={(e) => {
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
                                    <Col className="col-5 text-end align-self-center">
                                        Start Date:
                                    </Col>
                                    <Col>
                                        <Form.Control type="date" isInvalid={!validStartDate} onChange={(e) => {
                                            setStartDate(e.target.value);
                                        }}/>
                                    </Col>
                                </Row>
                                <Row className="pb-2">
                                    <Col className="col-5 text-end align-self-center">
                                        Start Time:
                                    </Col>
                                    <Col>
                                        <Form.Control type="time"
                                                      isInvalid={!validStartTime}
                                                      value={startTime}
                                                      onChange={(e) => {
                                                          let output = e.target.value.slice(0, 3);
                                                          let minutes = parseInt(e.target.value.slice(3, 5));
                                                          if (minutes % 15 === 1) {
                                                              minutes = (minutes + 14) % 60
                                                          } else if (minutes % 15 === 14) {
                                                              minutes = (minutes - 14)
                                                          } else if (minutes % 15 !== 0) {
                                                              minutes = (Math.round(minutes / 15) % 4) * 15
                                                          }
                                                          let minString = minutes.toString();
                                                          if (minString.length === 1) {
                                                              output += "0" + minString;
                                                          } else {
                                                              output += minString;
                                                          }
                                                          setStartTime(output);
                                                      }
                                                      }/>
                                    </Col>
                                </Row>
                                <Row className="pb-2">
                                    <Col className="col-5 text-end align-self-center">
                                        Hire Period:
                                    </Col>
                                    <Col>
                                        {(hireOptions === "") ? <>Loading hire periods...</> : <>
                                            <Form.Select isInvalid={!validHireSlot} defaultValue="none"
                                                         onChange={(e) => {
                                                             let value = e.target.value.split(',')
                                                             setHireChoiceId(value[0]);
                                                             setPrice(value[1]);
                                                         }}>

                                                <option value="none" key="none" disabled hidden>
                                                    Select Hire Period
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
                                <Row className="pb-2">
                                    <Col className="col-5 text-end align-self-center">
                                        Scooter:
                                    </Col>
                                    <Col>

                                        <Form.Select
                                            value={scooterChoiceId}
                                            isInvalid={!validScooter}
                                            disabled={scooters === ""}
                                            onChange={(e) => {
                                                setScooterChoiceId(e.target.value);
                                            }}>
                                            {scooters === "" ?
                                                <option value="" key="none" disabled hidden>Please fill in other
                                                    details</option> : <>
                                                    <option value="" key="none" disabled hidden>Select Scooter</option>
                                                    {scooters.map((scooter, idx) => (
                                                        <option value={scooter.scooterId}
                                                                key={idx}>{scooter.softScooterId}</option>
                                                    ))}
                                                </>
                                            }
                                        </Form.Select>

                                    </Col>
                                </Row>
                                {price === "" ? null : <h5>Cost: £{parseFloat(price).toFixed(2)}</h5>}
                                <h5>Payment details</h5>
                                <Row className="pb-2 small-padding-top">
                                    <Col className="col-5 text-end align-self-center">
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
                                    <Col className="col-5 text-end align-self-center">
                                        Expiry Date:
                                    </Col>
                                    <Col className="text-end">
                                        <Form.Control type="text" placeholder="MM/YY"
                                                      isInvalid={!validExpDate}
                                                      onInput={e => setExpiry(e.target.value)}/>
                                        <Form.Control.Feedback type="invalid">
                                            Invalid Expiry Date
                                        </Form.Control.Feedback>
                                    </Col>
                                </Row>
                                <Row className="pb-2">
                                    <Col className="col-5 text-end align-self-center">
                                        CVV:
                                    </Col>
                                    <Col className="text-end">
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
                        <Col className="box-staff">
                            {(map_locations === "") ? <p>Loading map locations...</p> :
                                <MapContainer center={[map_locations[0].latitude, map_locations[0].longitude]} zoom={15}
                                              zoomControl={false} className="minimap-guest">
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
                </div>
                <div className="booking-responsive-mobile">
                    <h5>Customer Details</h5>
                    <div className="padding-down">
                        Name:
                        <Form.Control type="text" placeholder="John Smith"
                                      isInvalid={!validName}
                                      onInput={e => setName(e.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            Enter Customer Name
                        </Form.Control.Feedback>
                    </div>
                    <div className="padding-down">
                        Email Address:
                        <Form.Control type="email" placeholder="name@example.com"
                                      isInvalid={!validEmail}
                                      onInput={e => setEmail(e.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            Invalid Email Address
                        </Form.Control.Feedback>
                    </div>
                    <div className="padding-down">
                        Confirm Email Address
                        <Form.Control type="email" placeholder="name@example.com"
                                      isInvalid={!validConfirm}
                                      onInput={e => setConfirmEmail(e.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            Email Address Does Not Match
                        </Form.Control.Feedback>
                    </div>
                    <br/>
                    <h5>Booking Details</h5>
                    <div className="padding-down">
                        Depot:
                        {(map_locations === "") ? <> Loading depots... </> :
                            <Form.Select value={depotChoiceId} isInvalid={!validDepot} onChange={(e) => {
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
                    </div>
                    <div className="padding-down">
                        Start Date:
                        <Form.Control type="date" isInvalid={!validStartDate} onChange={(e) => {
                            setStartDate(e.target.value);
                        }}/>
                    </div>
                    <div className="padding-down">
                        Start Time:
                        <Form.Control type="time"
                                      isInvalid={!validStartTime}
                                      value={startTime}
                                      onChange={(e) => {
                                          let output = e.target.value.slice(0, 3);
                                          let minutes = parseInt(e.target.value.slice(3, 5));
                                          if (minutes % 15 === 1) {
                                              minutes = (minutes + 14) % 60
                                          } else if (minutes % 15 === 14) {
                                              minutes = (minutes - 14)
                                          } else if (minutes % 15 !== 0) {
                                              minutes = (Math.round(minutes / 15) % 4) * 15
                                          }
                                          let minString = minutes.toString();
                                          if (minString.length === 1) {
                                              output += "0" + minString;
                                          } else {
                                              output += minString;
                                          }
                                          setStartTime(output);
                                      }
                                      }/>
                    </div>
                    <div className="padding-down">
                        Hire Period:
                        {(hireOptions === "") ? <>Loading hire periods...</> : <>
                            <Form.Select isInvalid={!validHireSlot} defaultValue="none" onChange={(e) => {
                                let value = e.target.value.split(',')
                                setHireChoiceId(value[0]);
                                setPrice(value[1]);
                            }}>
                                <option value="none" key="none" disabled hidden>Select Hire Period</option>
                                {hireOptions.map((option, idx) => (
                                    <option key={idx} value={[option.hireOptionId, option.cost]}>{option.name} -
                                        £{option.cost}</option>
                                ))}
                            </Form.Select>
                        </>
                        }
                    </div>
                    <div className="padding-down">
                        Scooter:
                        <Form.Select
                            value={scooterChoiceId}
                            isInvalid={!validScooter}
                            disabled={scooters === ""}
                            onChange={(e) => {
                                setScooterChoiceId(e.target.value);
                            }}>
                            {scooters === "" ?
                                <option value="" key="none" disabled hidden>Please fill in other details</option> : <>
                                    <option value="" key="none" disabled hidden>Select Scooter</option>
                                    {scooters.map((scooter, idx) => (
                                        <option value={scooter.scooterId}
                                                key={idx}>{scooter.softScooterId}</option>
                                    ))}
                                </>
                            }
                        </Form.Select>
                    </div>
                    <div className="padding-down">
                        {price === "" ? null : <h5>Cost: £{parseFloat(price).toFixed(2)}</h5>}
                    </div>
                    <br/>
                    <h5>Payment details</h5>
                    <div className="padding-down">
                        Card Number:
                        <Form.Control type="text" placeholder="4000-1234-5678-9010"
                                      isInvalid={!validCardNo}
                                      onInput={e => setCardNo(e.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            Invalid Card Number
                        </Form.Control.Feedback>
                    </div>
                    <div className="padding-down">
                        Expiry Date:
                        <Form.Control type="text" placeholder="MM/YY"
                                      isInvalid={!validExpDate}
                                      onInput={e => setExpiry(e.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            Invalid Expiry Date
                        </Form.Control.Feedback>
                    </div>
                    <div className="padding-down">
                        CVV:
                        <Form.Control type="text" placeholder="123"
                                      isInvalid={!validCVV}
                                      onInput={e => setCVV(e.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            Invalid CVV
                        </Form.Control.Feedback>
                    </div>
                </div>
                <div className="text-center">
                <Button onClick={createGuestBooking}>Confirm Booking</Button>
                </div>
            </Container>
        </>
    )
        ;
};