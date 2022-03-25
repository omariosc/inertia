import React, {useState} from "react";
import {Button, Col, Container, Row, InputGroup, Table, Form} from "react-bootstrap";
import './StaffInterface.css';
import host from './host';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function ScooterManagement() {
    const [slot, setSlot] = useState('');
    const [price, setPrice] = useState('');
    const [scooterCurrentId, setScooterCurrentId] = useState(100);
    const [scooterNewId, setScooterNewId] = useState();
    const [scooterName, setScooterName] = useState('');
    const [availability, setScooterAvailability] = useState('');
    const [scooterLocation, setScooterLocation] = useState('');

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
    const times = {
        "1 hour": 1,
        "4 hours": 4,
        "1 day": 24,
        "1 week": 168
    }
    const prices = [10, 35, 200, 1600]

    async function changePrice() {
        try {
            await fetch(host + 'api/admin/HireOptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    "durationInHours": times[slot],
                    "name": slot,
                    "cost": parseFloat(price),
                }),
                mode: "cors"
            })
        } catch (error) {
            console.error(error);
        }
    }

    async function editScooter() {
        try {
            await fetch(host + 'api/admin/Scooters/' + scooterCurrentId.toString(), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    "softScooterId": parseInt(scooterNewId),
                    "name": scooterName,
                    "depoId": scooterLocation.charCodeAt(0) - 64,
                    "available": ((availability === "Available") ? true : false)
                }),
                mode: "cors"
            })
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Scooter Management</h1>
            <br/>
            <Container>
                <Row>
                    <Col xs={7}>
                        <h3>Configure scooter availability</h3>
                        <br/>
                        <div className="scroll-scooters">
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Scooter ID</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Location</th>
                                </tr>
                                </thead>
                                <tbody>
                                {scooters.map((scooter, idx) => (
                                    <tr>
                                        <td>{scooter[0]}</td>
                                        <td>{scooter[1]}</td>
                                        <td>{scooter[2]}</td>
                                        <td>{scooter[3][2]} - {scooter[3][0]}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                    <Col xs={1}/>
                    <Col xs={4}>
                        <Row>
                            <h3>Configure scooter price</h3>
                            <br/>
                            <Form>
                                <Form.Group>
                                    <Form.Label><b>Price per time slot</b></Form.Label>
                                    <Form.Select
                                        className="dropdown-basic-button"
                                        title="Select hire period"
                                        defaultValue={"1 hour"}
                                        onChange={(e) => setSlot(e.target.value)}
                                    >
                                        {Object.keys(times).map((key, idx) => (
                                            <option key={idx} value={key}>{key} - £{prices[idx]}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <br/>
                                <br/>
                                <div>
                                    <Form.Group style={{float: "left"}}>
                                        <Form.Label><b>Change scooter price</b></Form.Label>
                                        <InputGroup>
                                            <input type="price" name="price" placeholder="Enter new price"
                                                   onInput={e => setPrice(e.target.value)} required/>
                                        </InputGroup>
                                    </Form.Group>
                                    <br/>
                                    <Form.Group style={{float: "right"}}>
                                        <Button variant="primary" onClick={changePrice}>Update price</Button>
                                    </Form.Group>
                                </div>
                            </Form>
                        </Row>
                        <br/>
                        <br/>
                        <Row>
                            <h3>Configure scooter details</h3>
                            <br/>
                            <Form>
                                <Form.Group>
                                    <Form.Label><b>Select scooter</b></Form.Label>
                                    <Form.Select className="dropdown-basic-button"
                                                 title="Choose scooter"
                                                 variant="primary"
                                                 defaultValue={100}
                                                 onChange={(e) => setScooterCurrentId(e.target.value)}
                                    >
                                        {scooters.map((scooter, idy) => (
                                            <option
                                                key={idy} value={scooter[0]}>{scooter[0]} - {scooter[1]}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <br/>
                                <br/>
                                <div>
                                    <Form.Group style={{float: "left", width: "47.5%"}}>
                                        <Form.Label><b>Change scooter ID</b></Form.Label>
                                        <InputGroup>
                                            <input name="scooter-name" placeholder="Enter new scooter ID" onInput={e => setScooterNewId(e.target.value)} required/>
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group style={{float: "right", width: "47.5%"}}>
                                        <Form.Label><b>Change scooter name</b></Form.Label>
                                        <InputGroup>
                                            <input name="scooter-id" placeholder="Enter new scooter name" onInput={e => setScooterName(e.target.value)} required/>
                                        </InputGroup>
                                    </Form.Group>
                                </div>
                                <br/>
                                <br/>
                                <Form.Group style={{paddingTop: "25px"}}>
                                    <Form.Label><b>Change scooter availability</b></Form.Label>
                                    <Form.Select className="dropdown-basic-button"
                                                 title="Choose scooter"
                                                 variant="primary"
                                                 defaultValue="Unavailable"
                                                 onChange={(e) => setScooterAvailability(e.target.value)}
                                    >
                                        {["Available", "Unavailable"].map((status, idy) => (
                                            <option key={idy} value={status}>{status}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <br/>
                                <br/>
                                <Form.Group>
                                    <Form.Label><b>Change scooter location</b></Form.Label>
                                    <Form.Select className="dropdown-basic-button"
                                                 title="Change scooter location"
                                                 variant="primary"
                                                 defaultValue="A"
                                                 onChange={(e) => setScooterLocation(e.target.value)}
                                    >
                                        {map_locations.map((location, idy) => (
                                            <option key={idy} value={location[2]}>{location[2]} - {location[0]}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <br/>
                                <br/>
                                <br/>
                                <Form.Group>
                                    <Button variant="primary" style={{float: "right"}} onClick={editScooter}>Save
                                        changes</Button>
                                </Form.Group>
                            </Form>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
        ;
}

export default ScooterManagement;