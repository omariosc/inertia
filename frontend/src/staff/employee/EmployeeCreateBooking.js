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
            <h3 id={"pageName"}>Create Guest Booking</h3>
            <hr id="underline"/>
            <br/>
            <Container>
                <Row>
                    <Col xs={6}>
                        <Form>
                            <div className="input">
                                <label>Email Address</label>
                                <input type="email" onInput={e => setEmail(e.target.value)}/>
                            </div>
                            <div className="input">
                                <label>Confirm Email Address</label>
                                <input type="email" onInput={e => setConfirmEmail(e.target.value)}/>
                            </div>
                            <div className="input">
                                <label>Phone Number</label>
                                <input type="text" onInput={e => setPhoneNo(e.target.value)}/>
                            </div>
                            <div className="input">
                                <label>Scooter</label>
                                {(map_locations === "") ?
                                    <p>Loading map locations...</p> :
                                    <>
                                        {(scooters === '') ?
                                            <p>Loading scooters...</p> :
                                            <select
                                                onChange={(e) => {
                                                    setScooterChoiceId(e.target.value);
                                                }}
                                            >
                                                <option value="none" key="none"/>
                                                {scooters.map((scooter, idx) => (
                                                    <option value={scooter.scooterId} key={idx}>
                                                        Scooter {scooter.softScooterId} ({String.fromCharCode(parseInt(scooter.depoId + 64))} - {map_locations[scooter.depoId - 1].name})</option>
                                                ))}
                                            </select>
                                        }
                                    </>
                                }
                            </div>
                            <div className="input">
                                <label>Hire Period</label>
                                {(hireOptions === '') ?
                                    <p>Loading hire options...</p> :
                                    <select
                                        onChange={(e) => {
                                            let value = e.target.value.split(',')
                                            setHireChoiceId(value[0]);
                                            setPrice(value[1])
                                        }}
                                    >
                                        <option value="none" key="none"/>
                                        {hireOptions.map((option, idx) => (
                                            <option key={idx} value={[option.hireOptionId, option.cost]}>{option.name} -
                                                £{option.cost}</option>
                                        ))}
                                    </select>
                                }
                            </div>
                            <br/>
                            <h5>Depot Details</h5>
                            <div className="input">
                                <label>Depot</label>
                                {(scooterChoiceId === '') ?
                                    <p>select scooter first</p> :
                                    <p>{String.fromCharCode(scooters.find(scooter => {return scooter.scooterId === parseInt(scooterChoiceId)}).depoId + 64)}</p>
                                }
                            </div>
                            <div className="input">
                                <label>Name</label>
                                {(scooterChoiceId === '') ?
                                    <p>select scooter first</p> :
                                    <p>{map_locations[scooters.find(scooter => {return scooter.scooterId === parseInt(scooterChoiceId)}).depoId - 1].name}</p>
                                }
                            </div>
                            <br/>
                            <h5>Payment Details</h5>
                            <br/>
                            <div className="input">
                                <label>Cost:</label>
                                {(isNaN(parseFloat(price))) ?
                                    <p>select hire period first</p> :
                                    <p>£{parseFloat(price).toFixed(2)}</p>
                                }
                            </div>
                            <div className="input">
                                <label>Card Number</label>
                                <input type="text" onInput={e => setCardNo(e.target.value)}/>
                            </div>
                            <div className="input">
                                <label>Expiry Date</label>
                                <input type="text" onInput={e => setExpiry(e.target.value)}/>
                            </div>
                            <div className="input">
                                <label>CVV</label>
                                <input type="text" onInput={e => setCVV(e.target.value)}/>
                            </div>
                            <Form.Group style={{paddingTop: "20px"}}>
                                <Button onClick={createGuestBooking}>Confirm Booking</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xs={6}>
                        {(map_locations === "") ?
                            <h5>Loading map locations...</h5> :
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
            </Container>
        </>
    );
};