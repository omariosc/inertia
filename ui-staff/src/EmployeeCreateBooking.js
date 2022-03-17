import React from "react";
import {Button, Col, Form, Row, Container} from "react-bootstrap";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import './StaffInterface.css'

function CreateBooking() {
    const map_locations = [
        ["Trinity Centre", [53.798351, -1.545100], "A"],
        ["Train Station", [53.796770, -1.540510], "B"],
        ["Merrion Centre", [53.801270, -1.543190], "C"],
        ["Leeds General Infirmary Hospital", [53.802509, -1.552887], "D"],
        ["UoL Edge Sports Centre", [53.804167, -1.553208], "E"],
    ]
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
    const price = 12.5
    return (
        <>
            <h1>Create Booking</h1>
            <Container>
                <Row>
                    <Col>
                        <Form>
                            <Form.Group>
                                <Form.Label>User Email</Form.Label>
                                <Form.Control type="email" required as="input"/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Card Number</Form.Label>
                                <Form.Control type="text" required as="input"/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Expiry Date</Form.Label>
                                <Form.Control type="text" required as="input"/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>CVV</Form.Label>
                                <Form.Control type="password" required as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label>Select Location</Form.Label>
                                <Form.Select id="dropdown-basic-button" title="Select location">
                                    {map_locations.map((location, idx) => (
                                        <option key={idx}>{location[2]} - {location[0]}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Select Scooter</Form.Label>
                                <Form.Select id="dropdown-basic-button" title="Select scooter">
                                    {scooters.map((scooter, idx) => (
                                        <option key={idx}>{scooter[0]}: {scooter[1]}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Select Hire Period</Form.Label>
                                <Form.Select id="dropdown-basic-button" title="Select hire period">
                                    {times.map((time, idx) => (
                                        <option key={idx}>{time}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Total: £{price.toFixed(2)}</Form.Label>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Button>Confirm Booking</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col>
                        <div class="map">
                            <MapContainer center={map_locations[2][1]} zoom={15} zoomControl={false}>
                                <TileLayer
                                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                                {map_locations.map((map_location, index) => (
                                    <Marker key={index} position={map_location[1]}>
                                        <Popup>{map_location[0]}</Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
        ;
}

export default CreateBooking;