import React, {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import validateCard from "./cardValidator";
import host from "./host";
import center from "./center";
import Cookies from 'universal-cookie';
import './StaffInterface.css';
import moment from "moment";

export default function CreateBooking({map_locations}) {
    const cookies = new Cookies();
    const [scooters, setScooters] = useState('');
    const [hireOptions, setHireOptions] = useState('');
    const [scooterChoiceId, setScooterChoiceId] = useState('');
    const [hireChoiceId, setHireChoiceId] = useState('');
    const [price, setPrice] = useState('');
    const [cardNo, setCardNo] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCVV] = useState('');
    const [discount, setDiscount] = useState(false);
    const [loading, setLoading] = useState('');
    const scooterStatus = ["In Depot", "Ongoing Order", "Pending Return", "Unavailable By Staff"];

    useEffect(() => {
        fetchAvailableScooters();
        fetchHirePeriods();
        fetchDiscountStatus();
    }, []);

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
            if (response.userType === 0 || response.userType === 1) {
                setDiscount(true);
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

    async function createBooking() {
        if (scooterChoiceId === '' || scooterChoiceId === 'none') {
            alert("Select a scooter.");
            return;
        }
        if (hireChoiceId === '' || hireChoiceId === 'none') {
            alert("Select a hire option.");
            return;
        }
        if (checkCardExists()) {
            if (!validateCard(cardNo, expiry, cvv)) {
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
                    'startTime': new Date(Date.now()).toISOString(),
                    'discount': discount ? 0.9 * parseFloat(price) : price
                }),
                mode: "cors"
            });
            let response = await request;
            if (response.status === 422) {
                alert("Scooter is currently unavailable.");
            } else if (response.status !== 200) {
                alert("Could not create booking.");
            } else {
                alert("Created booking.");
                if (checkCardExists()) {
                    cookies.set('cardNumber', cardNo, {path: '/'});
                    cookies.set('expiryDate', expiry, {path: '/'});
                    cookies.set('cvv', cvv, {path: '/'});
                }
            }
        } catch (error) {
            console.error(error);
        }
        await fetchAvailableScooters();
    }

    function checkCardExists() {
        return !(cookies.get('cardNumber') && cookies.get('expiryDate') && cookies.get('cvv'));
    }

    return (
        <div className="scroll">
            <h5>Select Booking Details</h5>
            <br/>
            <Form>
                <Form.Group style={{paddingRight: "15px"}}>
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
                                (scooter.scooterStatus === 0) ?
                                    <option value={scooter.scooterId} key={idx}>
                                        Scooter {scooter.softScooterId} ({String.fromCharCode(parseInt(scooter.depoId + 64))} - {map_locations[scooter.depoId - 1].name})
                                        ({scooterStatus[scooter.scooterStatus]})</option>
                                    : null
                            ))}
                        </Form.Select>
                    }
                </Form.Group>
                <br/>
                <MapContainer center={center} zoom={15} zoomControl={false} className="minimap"
                              style={{height: "325px", paddingRight: "100px"}}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    {map_locations.map((map_location, index) => (
                        <Marker key={index} position={[map_location.latitude, map_location.longitude]}>
                            <Popup>{map_location.name}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
                <br/>
                <Form.Group style={{paddingRight: "15px"}}>
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
                <div>
                    {(loading === '') ? null :
                        <>
                            {(discount) ?
                                <>
                                    <Form.Group style={{float: "right", paddingRight: "15px"}}>
                                        <Form.Label>
                                            <h6>10% Discount applied.
                                                {(hireChoiceId === '') ? null :
                                                    ` Total Cost: £${(0.9 * parseFloat(price)).toFixed(2)}`
                                                }
                                            </h6>
                                        </Form.Label>
                                    </Form.Group>
                                </> : <>
                                    {(hireChoiceId === '') ? null :
                                        <Form.Group style={{float: "right", paddingRight: "15px"}}>
                                            <Form.Label><h6>Total Cost: £{parseFloat(price).toFixed(2)}</h6>
                                            </Form.Label>
                                        </Form.Group>
                                    }
                                </>
                            }
                        </>
                    }
                    <br/>
                </div>
                <h5>Enter Card Details</h5>
                <br/>
                {checkCardExists() ?
                    <>
                        <Form.Group>
                            <Form.Label><h6>Card Number</h6></Form.Label>
                            <Form.Control type="text" placeholder="Enter customer card number" value={cardNo}
                                          onInput={e => setCardNo(e.target.value)}
                            />
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <Form.Label><h6>Expiry Date</h6></Form.Label>
                            <Form.Control type="text" placeholder="Enter customer card expiry date" value={expiry}
                                          onInput={e => setExpiry(e.target.value)}
                            />
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <Form.Label><h6>CVV</h6></Form.Label>
                            <Form.Control type="text" placeholder="Enter customer card cvv code" value={cvv}
                                          onInput={e => setCVV(e.target.value)}
                            />
                        </Form.Group>
                    </>
                    :
                    <>
                        <h6>Using Stored Card Details:</h6>
                        <p style={{margin: "0"}}>Card Number: **** ****
                            **** {cookies.get('cardNumber').slice(cookies.get('cardNumber').length - 4)}</p>
                        <p style={{margin: "0"}}>Expiry Date: {cookies.get('expiryDate')}</p>
                        <p style={{margin: "0"}}>CVV: {cookies.get('cvv')}</p>
                        <br/>
                        <Button onClick={() => {
                            cookies.remove('cardNumber');
                            cookies.remove('expiryDate');
                            cookies.remove('cvv')
                        }}>Delete card</Button>
                    </>
                }
                <br/>
                <Form.Group>
                    <Button style={{float: "right"}} onClick={createBooking}>Create Booking</Button>
                </Form.Group>
            </Form>
        </div>
    );
};