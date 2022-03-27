import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, InputGroup, Row, Table} from "react-bootstrap";
import './StaffInterface.css';
import host from './host';
import Cookies from 'universal-cookie';

export default function ScooterManagement({map_locations}) {
    const cookies = new Cookies();
    const [scooters, setScooters] = useState('');
    const [hireOptions, setHireOptions] = useState('');
    const [hireChoiceId, setHireChoiceId] = useState('');
    const [hireChoicePrice, setHireChoicePrice] = useState('');
    const [scooterCurrentId, setScooterCurrentId] = useState('');
    const [scooterCurrentSoftId, setScooterCurrentSoftId] = useState('');
    const [scooterNewId, setScooterNewId] = useState('');
    const [scooterAvailability, setScooterAvailability] = useState('');
    const [scooterLocation, setScooterLocation] = useState('');

    useEffect(() => {
        fetchScooters();
        fetchHirePeriods()
    }, []);

    async function fetchScooters() {
        let request = await fetch(host + "api/admin/Scooters", {
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

    async function changePrice() {
        if (hireChoiceId === '' || hireChoiceId === 'none') {
            alert("You must select a hire option.");
            return;
        }
        if (hireChoicePrice === '') {
            alert("Hire option price is required.");
            return;
        }
        if (!(hireChoicePrice.match(/^\d+(\.\d{0,2})?$/))) {
            alert("Enter a valid price.");
            return;
        }
        try {
            let request = await fetch(host + 'api/admin/HireOptions/' + hireChoiceId, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    "cost": hireChoicePrice
                }),
                mode: "cors"
            })
            let response = await request;
            if (response.status === 200) {
                alert("Changed price.")
            }
        } catch (error) {
            console.error(error);
        }
        await fetchHirePeriods();
    }

    async function editScooter() {
        if (scooterCurrentId === '' || scooterCurrentId === 'none') {
            alert("You must select a scooter.");
            return;
        }
        if (!(scooterNewId.match(/^\d+$/))) {
            alert("Scooter ID must be an integer.");
            return;
        }
        if (scooterAvailability === '' || scooterAvailability === 'none') {
            alert("You must select scooter availability.");
            return;
        }
        if (scooterLocation === '' || scooterLocation === 'none') {
            alert("You must select scooter location.");
            return;
        }
        try {
            let request = await fetch(host + 'api/admin/Scooters/' + scooterCurrentId.toString(), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    "softScooterId": scooterNewId,
                    "depoId": scooterLocation,
                    "available": (scooterAvailability === "Available")
                }),
                mode: "cors"
            })
            let response = await request.json();
            if (response.errorCode === 7) {
                alert("Scooter ID is already taken.");
            } else {
                alert("Changed scooter details.");
            }
        } catch (error) {
            console.error(error);
        }
        await fetchScooters();
    }

    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Scooter Management</h1>
            <br/>
            <Container>
                <Row>
                    <Col xs={5}>
                        <h3>Configure scooter availability</h3>
                        <br/>
                        <div className="scroll" style={{maxHeight: "40rem"}}>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Scooter ID</th>
                                    <th>Status</th>
                                    <th>Location</th>
                                </tr>
                                </thead>
                                <tbody>
                                {(scooters === '') ? null :
                                    scooters.map((scooter, idx) => (
                                        <tr key={idx}>
                                            <td>{scooter.softScooterId}</td>
                                            <td>{(scooter.available ? "Available" : "Unavailable")}</td>
                                            <td>{String.fromCharCode(scooter.depoId + 64)} - {map_locations[scooter.depoId - 1].name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                    <Col xs={1}/>
                    <Col xs={6}>
                        <Row>
                            <h3 style={{paddingBottom: "20px"}}>Configure scooter price</h3>
                            <Form>
                                <Form.Group>
                                    <Form.Label><b>Price per hire period</b></Form.Label>
                                    {(hireOptions === '') ?
                                        <h6>Loading</h6> :
                                        <Form.Select
                                            className="dropdown-basic-button"
                                            title="Select hire period"
                                            onChange={(e) => {
                                                setHireChoiceId(e.target.value)
                                            }}
                                            defaultValue="Select a time slot..."
                                        >
                                            <option value="none">Select a time slot...</option>
                                            {hireOptions.map((option, idx) => (
                                                <option key={idx} value={option.hireOptionId}>{option.name} -
                                                    £{option.cost}</option>
                                            ))}
                                        </Form.Select>
                                    }
                                </Form.Group>
                                <br/>
                                <br/>
                                <div>
                                    <Form.Group style={{float: "left"}}>
                                        <Form.Label><b>Change hire period price</b></Form.Label>
                                        <InputGroup>
                                            <input type="price" name="price" placeholder="Enter new price"
                                                   onInput={e => setHireChoicePrice(e.target.value)} required/>
                                        </InputGroup>
                                    </Form.Group>
                                    <br/>
                                    <Form.Group style={{float: "right"}}>
                                        <Button variant="primary" onClick={changePrice}>Update
                                            price</Button>
                                    </Form.Group>
                                </div>
                            </Form>
                        </Row>
                        <br/>
                        <br/>
                        <Row>
                            <h3 style={{paddingBottom: "20px"}}>Configure scooter details</h3>
                            {(scooters === '') ?
                                <h6>Loading</h6> :
                                <>
                                    <br/>
                                    <Form>
                                        <Form.Group>
                                            <Form.Label><b>Select scooter</b></Form.Label>
                                            <Form.Select
                                                defaultValue="Select a scooter..."
                                                onChange={(e) => {
                                                    let scooter = e.target.value.split(',')
                                                    setScooterCurrentId(scooter[0]);
                                                    setScooterCurrentSoftId(scooter[1])
                                                }}
                                            >
                                                <option value="none">Select a scooter...</option>
                                                {scooters.map((scooter, idy) => (
                                                    <option
                                                        key={idy}
                                                        value={[scooter.scooterId, scooter.softScooterId]}
                                                    >
                                                        Scooter {scooter.softScooterId}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                        <br/>
                                        <Form.Group>
                                            <Form.Label><b>Enter scooter ID</b></Form.Label>
                                            <InputGroup>
                                                <input name="scooter-name" placeholder={scooterCurrentSoftId}
                                                       onInput={e => setScooterNewId(e.target.value)} required/>
                                            </InputGroup>
                                        </Form.Group>
                                        <br/>
                                        <Form.Group>
                                            <Form.Label><b>Change scooter availability</b></Form.Label>
                                            <Form.Select
                                                defaultValue="Select availability..."
                                                onChange={(e) => {
                                                    setScooterAvailability(e.target.value)
                                                }}
                                            >
                                                <option value="none">Select availability...
                                                </option>
                                                {["Available", "Unavailable"].map((status, idy) => (
                                                    <option key={idy} value={status}>{status}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                        <br/>
                                        <Form.Group>
                                            <Form.Label><b>Change scooter
                                                location</b></Form.Label>
                                            <Form.Select
                                                variant="primary"
                                                defaultValue="Select location..."
                                                onChange={(e) => {
                                                    setScooterLocation(e.target.value)
                                                }}
                                            >
                                                <option value="none">Select location...
                                                </option>
                                                {map_locations.map((location, idy) => (
                                                    <option
                                                        key={idy}
                                                        value={location.depoId}
                                                    >
                                                        {String.fromCharCode(parseInt(location.depoId + 64))} - {location.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                        <br/>
                                        <Form.Group>
                                            <Button
                                                style={{float: "right"}}
                                                onClick={editScooter}>Save
                                                changes</Button>
                                        </Form.Group>
                                    </Form>
                                </>
                            }
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
}