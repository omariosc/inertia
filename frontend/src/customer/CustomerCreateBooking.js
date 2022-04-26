import React, {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import validateCard from "../cardValidator";
import scooterStatus from "../scooterStatus";
import moment from "moment";
import center from "../center";
import host from "../host";
import Cookies from 'universal-cookie';
import {NotificationManager} from "react-notifications";

export default function CustomerCreateBooking() {
    const cookies = new Cookies();
    const [map_locations, setMapLocations] = useState('');
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
            NotificationManager.warning("Select a scooter");
            return;
        }
        if (hireChoiceId === '' || hireChoiceId === 'none') {
            NotificationManager.warning("Select a hire option");
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
                NotificationManager.error("Scooter is currently unavailable", "Booking unsuccessful");
            } else if (response.status !== 200) {
                NotificationManager.error("Could not create booking", "Booking unsuccessful");
            } else {
                NotificationManager.success("Created booking", "Booking successful");
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
        <>
            <h5>Select Booking Details</h5>
            <Form>
                <Form.Group>
                    {(map_locations === "") ?
                        <h5>Loading map locations...</h5> :
                        <>
                            <Form.Label><b>Select Scooter</b></Form.Label>
                            {(scooters === '') ?
                                <p>Loading scooters...</p> :
                                <Form.Select
                                    onChange={(e) => {
                                        setScooterChoiceId(e.target.value);
                                    }}
                                >
                                    <option value="none" key="none" selected disabled hidden>Select scooter</option>
                                    {scooters.map((scooter, idx) => (
                                        (scooter.scooterStatus === 0) ?
                                            <option value={scooter.scooterId} key={idx}>
                                                Scooter {scooter.softScooterId} ({String.fromCharCode(parseInt(scooter.depoId + 64))} - {map_locations[scooter.depoId - 1].name})
                                                ({scooterStatus[scooter.scooterStatus]})</option>
                                            : null
                                    ))}
                                </Form.Select>
                            }
                        </>
                    }
                </Form.Group>
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

                <Form.Group>
                    <Form.Label><b>Select Hire Period</b></Form.Label>
                    {(hireOptions === '') ?
                        <p>Loading hire options...</p> :
                        <Form.Select
                            onChange={(e) => {
                                let value = e.target.value.split(',')
                                setHireChoiceId(value[0]);
                                setPrice(value[1])
                            }}
                        >
                            <option value="none" key="none" selected disabled hidden>Select hire period</option>
                            {hireOptions.map((option, idx) => (
                                <option key={idx} value={[option.hireOptionId, option.cost]}>{option.name} -
                                    £{option.cost}</option>
                            ))}
                        </Form.Select>
                    }
                </Form.Group>

                <div>
                    {(loading === '') ? null :
                        <>
                            {(discount) ?
                                <>
                                    <Form.Group className="float-end customer-create-booking-padding">
                                        <Form.Label>
                                            <b>10% Discount applied.
                                                {(hireChoiceId === '') ? null :
                                                    ` Total Cost: £${(0.9 * parseFloat(price)).toFixed(2)}`
                                                }
                                            </b>
                                        </Form.Label>
                                    </Form.Group>
                                </> : <>
                                    {(hireChoiceId === '') ? null :
                                        <Form.Group className="float-end customer-create-booking-padding">
                                            <Form.Label><b>Total Cost: £{parseFloat(price).toFixed(2)}</b>
                                            </Form.Label>
                                        </Form.Group>
                                    }
                                </>
                            }
                        </>
                    }

                </div>
                <h5>Enter Card Details</h5>

                {checkCardExists() ?
                    <>
                        <Form.Group>
                            <Form.Label><b>Card Number</b></Form.Label>
                            <Form.Control type="text" placeholder="Enter customer card number" value={cardNo}
                                          onInput={e => setCardNo(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label><b>Expiry Date</b></Form.Label>
                            <Form.Control type="text" placeholder="Enter customer card expiry date" value={expiry}
                                          onInput={e => setExpiry(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label><b>CVV</b></Form.Label>
                            <Form.Control type="text" placeholder="Enter customer card cvv code" value={cvv}
                                          onInput={e => setCVV(e.target.value)}
                            />
                        </Form.Group>
                    </>
                    :
                    <>
                        <b>Using Stored Card Details:</b>
                        <p className="m-0">Card Number: **** ****
                            **** {cookies.get('cardNumber').slice(cookies.get('cardNumber').length - 4)}</p>
                        <p className="m-0">Expiry Date: {cookies.get('expiryDate')}</p>
                        <p className="m-0">CVV: {cookies.get('cvv')}</p>

                        <Button onClick={() => {
                            cookies.remove('cardNumber');
                            cookies.remove('expiryDate');
                            cookies.remove('cvv')
                        }}>Delete card</Button>
                    </>
                }
                <Form.Group>
                    <Button className="float-end" onClick={createBooking}>Create Booking</Button>
                </Form.Group>
            </Form>
        </>
    );
};