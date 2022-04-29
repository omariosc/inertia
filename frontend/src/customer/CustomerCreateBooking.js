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
    const [saveCard, setSaveCard] = useState(false);

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

    async function createBooking() {
        setValidScooter(scooterChoiceId !== '' && scooterChoiceId !== 'none');
        setValidHireSlot(hireChoiceId !== '' && hireChoiceId !== 'none');
        setValidCardNo(cardNo.length > 9 && cardNo.length < 20);
        setValidExpDate(expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/));
        setValidCVV(cvv.match(/^[0-9]{3,4}$/));
        if (!(scooterChoiceId !== '' && scooterChoiceId !== 'none'
            && hireChoiceId !== '' && hireChoiceId !== 'none'
            && cardNo.length > 9 && cardNo.length < 20
            && expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/)
            && cvv.match(/^[0-9]{3,4}$/))) {
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
                    'startTime': new Date(Date.now()).toISOString()
                }),
                mode: "cors"
            });
            let response = await request;
            if (response.status === 422) {
                NotificationManager.error("Scooter is currently unavailable.", "Error");
            } else if (response.status === 400) {
                NotificationManager.error("Please fill in all required fields.", "Error");
            } else if (response.status === 200) {
                NotificationManager.success("Created Booking.", "Success");
                if (!checkCardExists() && saveCard) {
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
                            <Col>Cost £{(hireChoiceId === '') ? null :
                                `${parseFloat(price).toFixed(2)}`
                            }
                            </Col>
                        </Row>
        )
    }

    return (
        <Container>
            <Row className="mapMaxHeightRow">
                {(map_locations === "") ? <Col>Loading map locations...</Col> :
                    <Col className="box">
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
                    </Col>
                }
            </Row>
            <br className="mobile"/>
            <h5>Booking Details</h5>
            <Row className="pb-2">
                <Col className="text-end col-3 align-self-center">
                    Depot:
                </Col>
                <Col>
                    {(map_locations === "") ? <> Loading depots... </> :
                        <Form.Select value={depotChoiceId} isInvalid={!validScooter} onChange={(e) => {
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
                    Scooter:
                </Col>
                <Col>
                    {(scooters === "") ? <> Loading scooters... </> :
                        <Form.Select
                            value={scooterChoiceId}
                            isInvalid={!validScooter}
                            disabled={depotChoiceId === ""}
                            onChange={(e) => {
                                setScooterChoiceId(e.target.value);
                            }}>
                            {depotChoiceId === "" ?
                                <option value="" key="none" disabled hidden>Select Depot First</option> : <>
                                    <option value="" key="none" disabled hidden>Select Scooter</option>
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
                <Col className="text-end col-3 align-self-center">
                    Hire Period:
                </Col>
                <Col>
                    {(hireOptions === "") ? <>Loading hire periods...</> : <>
                        <Form.Select isInvalid={!validHireSlot} defaultValue="none" onChange={(e) => {
                            let value = e.target.value.split(',')
                            setHireChoiceId(value[0]);
                            setPrice(value[1])
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
            <br/>
            <DisplayCost/>
            <div className="issue-filters">
                {!checkCardExists() ?
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
                    </>
                    : <>
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
                                        navigate('/create-booking');
                                        NotificationManager.success("Deleted credit card details.", "Success");
                                    }}>
                                    Delete Card Details
                                </Button>
                            </Col>
                        </Row>
                    </>
                }
            </div>
            <div className="issue-filters-mobile">
                {!checkCardExists() ?
                    <>
                        <h5>Payment details</h5>
                        <Row className="small-padding-bottom">
                            Save Card Details:
                            <Col>
                                <Form.Switch onClick={(e) => setSaveCard(e.target.checked)}/>
                            </Col>
                        </Row>
                        <Row className="small-padding-bottom">
                            Card Number:
                            <Form.Control type="text" placeholder="4000-1234-5678-9010" isInvalid={!validCardNo}
                                          onInput={e => setCardNo(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">
                                Invalid Card Number
                            </Form.Control.Feedback>
                        </Row>
                        <Row className="small-padding-bottom">
                            Expiry Date:
                            <Form.Control type="text" placeholder="MM/YY" isInvalid={!validExpDate}
                                          onInput={e => setExpiry(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">
                                Invalid Expiry Date
                            </Form.Control.Feedback>
                        </Row>
                        <Row>
                            CVV:
                            <Form.Control type="text" placeholder="123" isInvalid={!validCVV}
                                          onInput={e => setCVV(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">
                                Invalid CVV
                            </Form.Control.Feedback>
                        </Row>
                    </>
                    : <>
                        <h5>Using stored payment details</h5>
                        <p>Card Number: **** ****
                            **** {cookies.get('cardNumber').slice(cookies.get('cardNumber').length - 4)} </p>
                        <p>Expiry Date: {cookies.get('expiryDate')} </p>
                        <Button
                            variant="danger"
                            className="float-right"
                            onClick={() => {
                                cookies.remove('cardNumber');
                                cookies.remove('expiryDate');
                                cookies.remove('cvv');
                                navigate('/create-booking');
                                NotificationManager.success("Deleted credit card details.", "Success");
                            }}>
                            Delete Card Details
                        </Button>
                        <br/>
                        <br/>
                    </>
                }
            </div>
            <br/>
            <Button className="float-right"
                    onClick={createBooking}>Confirm Booking</Button>
        </Container>
    );
};