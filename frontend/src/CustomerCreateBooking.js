import React, {useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import host from "./host";
import Cookies from 'universal-cookie';
import './StaffInterface.css';

export default function CreateBooking({map_locations}) {
    const cookies = new Cookies();
    const center = [53.8010441, -1.5497378];
    const [scooters, setScooters] = useState('');
    const [hireOptions, setHireOptions] = useState('');
    const [scooterChoice, setScooterChoice] = useState('');
    const [hireChoice, setHireChoice] = useState('');
    const [cardNo, setCardNo] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCVV] = useState('');
    const discount = false;

    useEffect(() => {
        fetchScooters();
        fetchHirePeriods();
    }, []);

    async function fetchHirePeriods() {
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
    }

    async function fetchScooters() {
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
    }

    async function makeBooking() {
        cookies.set('cardNumber', cardNo, {path: '/'});
        cookies.set('expiryDate', expiry, {path: '/'});
        cookies.set('cvv', cvv, {path: '/'});
        console.log(scooterChoice);
        console.log(hireChoice);
        try {
            await fetch(host + "api/Orders", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    'hireOptionId': scooterChoice,
                    'scooterId': hireChoice,
                    'startTime': '2022-03-26T15:28:19.875082'
                }),
                mode: "cors"
            });
        } catch (error) {
            console.error(error);
        }
    }

    function checkCardExists() {
        return !(cookies.get('cardNumber') && cookies.get('expiryDate') && cookies.get('cvv'));
    }

    return (
        <div className="scroll">
            <h5>Select Booking Details</h5>
            <br/>
            <Form>
                <Form.Group>
                    <Form.Label><h6>Select Location</h6></Form.Label>
                    <Form.Select
                        className="dropdown-basic-button"
                        defaultValue={map_locations[0].depoId}
                    >
                        {map_locations.map((location) => (
                            <option value={location.depoId}>{location.depoId} - {location.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <br/>
                <br/>
                <MapContainer center={center} zoom={15} zoomControl={false} className="minimap"
                              style={{height: "325px"}}>
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
                <Form.Group>
                    <Form.Label><h6>Select Scooter</h6></Form.Label>
                    {(scooters === '') ?
                        <h6>Loading</h6> :
                        <Form.Select
                            className="dropdown-basic-button"
                            onChange={(e) => {
                                setScooterChoice(e.target.value)
                            }}
                        >
                            {scooters.map((scooter, idx) => (
                                <option key={idx} value={scooter.id}>Scooter {scooter.softScooterId}</option>
                            ))}
                        </Form.Select>}
                </Form.Group>
                <br/>
                <br/>
                <Form.Group>
                    <Form.Label><h6>Select Hire Period</h6></Form.Label>
                    {(hireOptions === '') ?
                        <h6>Loading</h6> :
                        <Form.Select
                            className="dropdown-basic-button"
                            onChange={(e) => {
                                setHireChoice(e.target.value)
                            }}
                        >
                            {hireOptions.map((option, idx) => (
                                <option key={idx} value={option.hireOptionId}>{option.name} - £{option.cost}</option>
                            ))}
                        </Form.Select>
                    }
                </Form.Group>
                <br/>
                <br/>
                <div>
                    {discount ?
                        <>
                            <Form.Group style={{float: "left"}}>
                                <Form.Label><h6>10% Discount applied</h6></Form.Label>
                            </Form.Group>
                            {(hireChoice === '') ?
                                <h6>Loading</h6>
                                :
                                <Form.Group style={{float: "right"}}>
                                    <Form.Label><h6>Total Cost: £{(0.9 * parseFloat(hireChoice.cost)).toFixed(2)}</h6>
                                    </Form.Label>
                                </Form.Group>
                            }
                        </> : <>
                            {(hireChoice === '') ?
                                <h6>Loading</h6>
                                :
                                <Form.Group style={{float: "right"}}>
                                    <Form.Label><h6>Total Cost: £{parseFloat(hireChoice.cost).toFixed(2)}</h6>
                                    </Form.Label>
                                </Form.Group>
                            }
                        </>
                    }
                </div>
                <br/>
                <h5>Enter Card Details</h5>
                <br/>
                {checkCardExists() ?
                    <>
                        <Form.Group>
                            <Form.Label><h6>Card Number</h6></Form.Label>
                            <Form.Control
                                type="text"
                                value={cardNo}
                                onInput={e => setCardNo(e.target.value)}
                            />
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <Form.Label><h6>Expiry Date</h6></Form.Label>
                            <Form.Control
                                type="text"
                                value={expiry}
                                onInput={e => setExpiry(e.target.value)}
                            />
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <Form.Label><h6>CVV</h6></Form.Label>
                            <Form.Control
                                type="text"
                                value={cvv}
                                onInput={e => setCVV(e.target.value)}
                            />
                        </Form.Group>
                    </>
                    :
                    <>
                        <h6>Using Stored Card Details:</h6>
                        <p style={{margin: "0"}}>Card Number: {cookies.get('cardNumber')}</p>
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
                    <Button style={{float: "right"}} onClick={makeBooking}>Confirm Booking</Button>
                </Form.Group>
            </Form>
        </div>
    );
}