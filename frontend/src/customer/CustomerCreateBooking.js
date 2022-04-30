import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import Cookies from 'universal-cookie';
import host from "../host";
import moment from "moment";

export default function CustomerCreateBooking() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const [map_locations, setMapLocations] = useState('');
    const [scooters, setScooters] = useState('');
    const [hireOptions, setHireOptions] = useState('');
    const [depotChoiceId, setDepotChoiceId] = useState('');
    const [scooterChoiceId, setScooterChoiceId] = useState('');
    const [hireChoiceId, setHireChoiceId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [price, setPrice] = useState('');
    const [cardNo, setCardNo] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCVV] = useState('');
    const [validDepot, setValidDepot] = useState(true);
    const [validScooter, setValidScooter] = useState(true);
    const [validHireSlot, setValidHireSlot] = useState(true);
    const [validStartDate, setValidStartDate] = useState(true);
    const [validStartTime, setValidStartTime] = useState(true);
    const [validCardNo, setValidCardNo] = useState(true);
    const [validExpDate, setValidExpDate] = useState(true);
    const [validCVV, setValidCVV] = useState(true);
    const [discount, setDiscount] = useState(false);
    const [discountType, setDiscountType] = useState('');
    const [loading, setLoading] = useState('');
    const [saveCard, setSaveCard] = useState(false);
    const [savedDetailsDeleted, setSavedDetailsDeleted] = useState(false);

    useEffect(() => {
        fetchHirePeriods();
        fetchDiscountStatus();
        fetchLocations();
    }, []);

    useEffect(() => {
        fetchAvailableScooters();

    }, [startTime, startDate, hireChoiceId, depotChoiceId]);

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
                if (recentBookings[i].orderState !== 0 && recentBookings[i].orderState !== 6) {
                    recentHours += recentBookings[i].hireOption.durationInHours;
                    if (recentBookings[i]["extensions"] != null) {
                        for (let j = 0; j < recentBookings[i]["extensions"].length; j++) {
                            recentHours += recentBookings[i]["extensions"][j].hireOption.durationInHours;
                        }
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
            setHireOptions((await request.json()).sort((a, b) => a.cost - b.cost));
        } catch (error) {
            console.error(error);
        }
    }

    function calcStartIso() {
        let hours = parseInt(startTime.slice(0, 2));
        let mins = parseInt(startTime.slice(3, 5));
        let bookingStart = new Date(startDate);
        bookingStart.setHours(hours, mins, 0, 0);
        return bookingStart.toISOString()
    }

    function calcEndIso() {
        let hours = parseInt(startTime.slice(0, 2));
        let mins = parseInt(startTime.slice(3, 5));
        let bookingEnd = new Date(startDate);
        let duration = hireOptions.find(x => x.hireOptionId === parseInt(hireChoiceId)).durationInHours;
        bookingEnd.setHours(hours + duration, mins, 0, 0);
        return bookingEnd.toISOString()
    }

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
                        'Authorization': `Bearer ${cookies.get('accessToken')}`
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

    function validateDepot(stateChange) {
        let valid = depotChoiceId !== '' && depotChoiceId !== 'none';
        if (stateChange) {
            setValidDepot(valid);
        }
        return valid;
    }

    function validateScooter(stateChange) {
        let valid = scooterChoiceId !== '' && scooterChoiceId !== 'none';
        if (stateChange) {
            setValidScooter(valid);
        }
        return valid;
    }

    function validateHireSlot(stateChange) {
        let valid = hireChoiceId !== '' && hireChoiceId !== 'none';
        if (stateChange) {
            setValidHireSlot(valid);
        }
        return valid;
    }

    function validateCardNo(stateChange) {
        if(cookies.get('cardNumber')){
            return true;
        }
        let valid = cardNo.length > 9 && cardNo.length < 20;
        if (stateChange) {
            setValidCardNo(valid);
        }
        return valid;
    }

    function validateExpDate(stateChange) {
        if(cookies.get('expiryDate')){
            return true;
        }
        let valid = expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/);
        if (stateChange) {
            setValidExpDate(valid);
        }
        return valid;
    }

    function validateCVV(stateChange) {
        if(cookies.get('cvv')){
            return true;
        }
        let valid = cvv.match(/^[0-9]{3,4}$/);
        if (stateChange) {
            setValidCVV(valid);
        }
        return valid;
    }


    async function createBooking() {
        let valid = true
        let validateFuncs = [validateTime, validateDate, validateDepot, validateScooter, validateHireSlot, validateCardNo, validateCVV, validateExpDate]
        validateFuncs.forEach((validateTerm) => {
            if (valid) {
                valid = validateTerm(true);
            } else {
                validateTerm(true);
            }

        })
        if (!valid) {
            NotificationManager.error("Invalid Details Provided", "Error");
            return;
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
                    'startTime': startDate + "T" + startTime
                }),
                mode: "cors"
            });
            let response = await request;
            if (response.status === 422) {
                NotificationManager.error("Scooter is unavailable at this time.", "Error");
            } else if (response.status === 400) {
                NotificationManager.error("Please fill in all required fields.", "Error");
            } else if (response.status === 200) {
                NotificationManager.success("Created Booking.", "Success");
                if ((!checkCardExists() || savedDetailsDeleted) && saveCard) {
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
                        <Row className="pb-2">
                            <Col>
                                {(hireChoiceId === '') ? null :
                                    <>
                                        <h5>Cost: £{(0.9 * parseFloat(price)).toFixed(2)}</h5>
                                        <Row className="pb-2">
                                            <Col className="text-end col-3 align-self-center">
                                                Discount:
                                            </Col>
                                            <Col>
                                                {discountType} (10%) applied
                                            </Col>
                                        </Row>
                                    </>
                                }
                            </Col>
                        </Row> :
                        <Row className="pb-2">
                            <Col>
                                {(hireChoiceId === '') ? <h5>Cost £</h5> : <h5>Cost £{parseFloat(price).toFixed(2)}</h5>
                                }
                            </Col>
                        </Row>
        )
    }

    return (
        <Container>
            <Row className="mapMaxHeightRow">
                {(map_locations === "") ? <Col>Loading map locations...</Col> :
                    <Col className="box col=12">
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
                                                setScooterChoiceId("");
                                                setDepotChoiceId(map_location.depoId);
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
                    </Col>
                }
            </Row>
            <br/>
            <h5>Booking Details</h5>
            <Row className="pb-2">
                <Col className="text-end col-3 align-self-center">
                    Depot:
                </Col>
                <Col>
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
                </Col>
            </Row>
            <Row className="pb-2">
                <Col className="text-end col-3 align-self-center">
                    Start Time:
                </Col>
                <Col>
                    <Form.Control type="date" isInvalid={!validStartDate} onChange={(e) => {
                        setStartDate(e.target.value);
                    }}/>
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
                <Col className="text-end col-3 align-self-center">
                    Hire Period:
                </Col>
                <Col>
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
                </Col>
            </Row>
            <Row className="pb-2">
                <Col className="text-end col-3 align-self-center">
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
                            <option value="" key="none" disabled hidden>Please fill in other details</option> : <>
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
            <br/>
            <DisplayCost/>
            {!checkCardExists() || savedDetailsDeleted ?
                <>
                    <h5>Payment details</h5>
                    <Row className="pb-2 small-padding-top">
                        <Col className="text-end col-3 align-self-center">
                            Save Card Details:
                        </Col>
                        <Col>
                            <Form.Switch onClick={(e) =>
                                setSaveCard(e.target.checked)}/>
                        </Col>
                    </Row>
                    <Row className="pb-2 small-padding-top">
                        <Col className="text-end col-3 align-self-center">
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
                        <Col className="text-end col-3 align-self-center">
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
                        <Col className="text-end col-3 align-self-center">
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
                </> : <>
                    <h5>Using stored payment details</h5>
                    <Row>
                        <Col className="text-end col-3 align-self-center">
                            Card Number:
                        </Col>
                        <Col>
                            **** ****
                            **** {cookies.get('cardNumber').slice(cookies.get('cardNumber').length - 4)}
                        </Col>
                    </Row>
                    <Row className="pb-2 ">
                        <Col className="text-end col-3 align-self-center">
                            Expiry Date:
                        </Col>
                        <Col>
                            {cookies.get('expiryDate')}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="offset-3">
                            <Button
                                variant="danger"
                                onClick={() => {
                                    cookies.remove('cardNumber');
                                    cookies.remove('expiryDate');
                                    cookies.remove('cvv');
                                    setSavedDetailsDeleted(true);
                                    NotificationManager.success("Deleted credit card details.", "Success");
                                }}>
                                Delete Card Details
                            </Button>
                        </Col>
                    </Row>
                </>
            }
            <br/>
            <Button className="float-right"
                    onClick={createBooking}>Confirm Booking</Button>
            <br/>
            <br/>
            <br/>
        </Container>
    );
};