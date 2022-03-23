import React, {useState} from "react";
import {Button, Form} from "react-bootstrap";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import './StaffInterface.css'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function CreateBooking() {
    const map_locations = [
        ["Trinity Centre", [53.798351, -1.545100], "A"],
        ["Train Station", [53.796770, -1.540510], "B"],
        ["Merrion Centre", [53.801270, -1.543190], "C"],
        ["Leeds General Infirmary Hospital", [53.802509, -1.552887], "D"],
        ["UoL Edge Sports Centre", [53.804167, -1.553208], "E"],
    ]
    const center = [53.8010441, -1.5497378]
    const scooters = [
        [100, "Scooter A", "Available", map_locations[0]],
        [101, "Scooter B", "Available", map_locations[0]],
        [102, "Scooter C", "Available", map_locations[0]],
        [103, "Scooter D", "Available", map_locations[0]],
        [104, "Scooter E", "Available", map_locations[0]],
        [105, "Scooter F", "Available", map_locations[0]],
        [106, "Scooter G", "Available", map_locations[0]],
        [107, "Scooter H", "Available", map_locations[0]],
        [108, "Scooter I", "Available", map_locations[0]],
        [109, "Scooter J", "Available", map_locations[0]],
        [200, "Scooter K", "Available", map_locations[0]],
        [201, "Scooter L", "Available", map_locations[0]],
        [202, "Scooter M", "Available", map_locations[0]],
        [203, "Scooter N", "Available", map_locations[0]],
        [204, "Scooter O", "Available", map_locations[0]],
        [205, "Scooter P", "Available", map_locations[0]],
        [206, "Scooter Q", "Available", map_locations[0]],
        [207, "Scooter R", "Available", map_locations[0]],
        [208, "Scooter S", "Available", map_locations[0]],
        [209, "Scooter T", "Available", map_locations[0]]]
    const times = ["1 hour", "4 hours", "1 day", "1 week"]
    const price = [10, 30, 100, 1000]
    const [cardNo, setCardNo] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvv, setCVV] = useState('')

    function onSubmit() {
        cookies.set('cardNumber', cardNo, {path: '/'});
        cookies.set('expiryDate', expiry, {path: '/'});
        cookies.set('cvv', cvv, {path: '/'});
    }

    function setCookieCardNo(value) {
        setCardNo(value)
    }

    function setCookieExpiry(value) {
        setExpiry(value)
    }

    function setCookieCVV(value) {
        setCVV(value)
    }

    function checkCardExists() {
        if (cookies.get('cardNumber') != null && cookies.get('cardNumber') != null && cookies.get('cardNumber') != null) {
            return false;
        } else {
            return true;
        }
    }

    return (
        <div className="scroll">
            <h5>Select Booking Details</h5>
            <br/>
            <Form>
                <Form.Group>
                    <Form.Label><h6>Select Location</h6></Form.Label>
                    <Form.Select id="dropdown-basic-button" title="Select location">
                        {map_locations.map((location, idx) => (
                            <option key={idx}>{location[2]} - {location[0]}</option>
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
                        <Marker key={index} position={map_location[1]}>
                            <Popup>{map_location[0]}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
                <br/>
                <Form.Group>
                    <Form.Label><h6>Select Scooter</h6></Form.Label>
                    <Form.Select id="dropdown-basic-button" title="Select scooter">
                        {scooters.map((scooter, idx) => (
                            <option key={idx}>{scooter[0]} - {scooter[1]}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <br/>
                <br/>
                <Form.Group>
                    <Form.Label><h6>Select Hire Period</h6></Form.Label>
                    <Form.Select id="dropdown-basic-button" title="Select hire period">
                        {times.map((time, idx) => (
                            <option key={idx}>{time} - £{price[idx]}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <br/>
                <br/>
                <div>
                    <Form.Group style={{float: "left"}}>
                        <Form.Label><h6>10% Student Discount applied</h6></Form.Label>
                    </Form.Group>
                    <Form.Group style={{float: "right"}}>
                        <Form.Label><h6>Total Cost: £{(0.9 * price[0]).toFixed(2)}</h6></Form.Label>
                    </Form.Group>
                </div>
                <br/>
                <br/>
                <br/>
                <h5>Enter Card Details</h5>
                <br/>
                {checkCardExists() ?
                    <>
                        <Form.Group>
                            <Form.Label><h6>Card Number</h6></Form.Label>
                            <Form.Control
                                type="text"
                                required as="input"
                                value={cardNo}
                                onInput={e => setCookieCardNo(e.target.value)}
                            />
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <Form.Label><h6>Expiry Date</h6></Form.Label>
                            <Form.Control
                                type="text"
                                required as="input"
                                value={expiry}
                                onInput={e => setCookieExpiry(e.target.value)}
                            />
                        </Form.Group>
                        <br/>
                        <Form.Group>
                            <Form.Label><h6>CVV</h6></Form.Label>
                            <Form.Control
                                type="text"
                                required as="input"
                                value={cvv}
                                onInput={e => setCookieCVV(e.target.value)}
                            />
                        </Form.Group>
                    </>
                    :
                    <>
                        <h6>Using Stored Card Details:</h6>
                        <h7>Card Number: {cookies.get('cardNumber')}</h7>
                        <br/>
                        <h7>Expiry Date: {cookies.get('expiryDate')}</h7>
                        <br/>
                        <h7>CVV: {cookies.get('cvv')}</h7>
                        <br/>
                        <br/>
                        <Button variant="primary" onClick={() => {
                            cookies.remove('cardNumber');
                            cookies.remove('expiryDate');
                            cookies.remove('cvv')
                        }}>Delete card</Button>
                    </>
                }
                <br/>
                <Form.Group>
                    <Button variant="primary" style={{float: "right"}} onClick={onSubmit}>Confirm Booking</Button>
                </Form.Group>
            </Form>
        </div>
    );
}

export default CreateBooking;