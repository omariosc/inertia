import React from "react";
import {Button, Col, Form, Row, Container} from "react-bootstrap";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import './StaffInterface.css';

export default function CreateBooking() {
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
    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Create Booking</h1>
            <br/>
            <Container>
                <Row>
                    <Col xs={3}>
                        <h3>Enter Customer Details</h3>
                        <br/>
                        <Form>
                            <Form.Group>
                                <Form.Label><b>Name</b></Form.Label>
                                <Form.Control type="name"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>User Email</b></Form.Label>
                                <Form.Control type="email"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Card Number</b></Form.Label>
                                <Form.Control type="text"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Expiry Date</b></Form.Label>
                                <Form.Control type="text"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>CVV</b></Form.Label>
                                <Form.Control type="password"/>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xs={1}/>
                    <Col xs={3}>
                        <h3>Enter Booking Details</h3>
                        <br/>
                        <Form>
                            <Form.Group>
                                <Form.Label><b>Select Location</b></Form.Label>
                                <Form.Select className="dropdown-basic-button">
                                    {map_locations.map((location) => (
                                        <option>{location[2]} - {location[0]}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <br/>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Select Scooter</b></Form.Label>
                                <Form.Select className="dropdown-basic-button">
                                    {scooters.map((scooter, ) => (
                                        <option>{scooter[0]} - {scooter[1]}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <br/>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Select Hire Period</b></Form.Label>
                                <Form.Select className="dropdown-basic-button">
                                    {times.map((time, idx) => (
                                        <option>{time} - £{price[idx]}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <br/>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Total Cost: £{price[0].toFixed(2)}</b></Form.Label>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Button style={{float: "right"}}>Confirm Booking</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xs={1}/>
                    <Col xs={4}>
                        <MapContainer center={center} zoom={15} zoomControl={false} className="minimap">
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                            {map_locations.map((map_location, index) => (
                                <Marker key={index} position={map_location[1]}>
                                    <Popup>{map_location[0]}</Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </Col>
                </Row>
            </Container>
        </>
    );
}