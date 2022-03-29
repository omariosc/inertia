import React, {useEffect, useState} from "react";
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import host from './host';
import Cookies from 'universal-cookie';
import './StaffInterface.css';

export default function ScooterManagement({map_locations}) {
    const cookies = new Cookies();
    const [scooters, setScooters] = useState('');
    const [scooterCurrentId, setScooterCurrentId] = useState('');
    const [scooterCurrentAvailability, setScooterCurrentAvailability] = useState('');
    const [scooterAvailability, setScooterAvailability] = useState('');

    useEffect(() => {
        fetchScooters();
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


    async function editScooter() {
        if (scooterCurrentId === '' || scooterCurrentId === 'none') {
            alert("You must select a scooter.");
            return;
        }
        if (scooterAvailability === '' || scooterAvailability === 'none') {
            alert("You must select scooter availability.");
            return;
        }
        if ((scooterAvailability === 'Make Available' && scooterCurrentAvailability === 'true')
            || (scooterAvailability === 'Make Unavailable' && scooterCurrentAvailability === 'false')) {
            alert("Scooter availability must be different.");
            return;
        }
        console.log(scooterCurrentId)
        console.log(scooterCurrentAvailability)
        console.log(scooterAvailability)
        console.log(typeof (scooterCurrentAvailability))
        console.log(typeof (scooterAvailability))
        try {
            await fetch(host + 'api/admin/Scooters/' + scooterCurrentId.toString(), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    "available": (scooterAvailability === "Make Available")
                }),
                mode: "cors"
            });
            alert("Changed scooter details.");
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
                    <Col xs={7}>
                        <h3>View Scooters</h3>
                        <br/>
                        <div className="scroll" style={{maxHeight: "40rem", overflowX: "hidden"}}>
                            <Table striped bordered hover style={{tableLayout: 'fixed'}}>
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
                    <Col xs={4}>
                        <Row>
                            <h3 style={{paddingBottom: "20px"}}>Configure scooter availability</h3>
                            {(scooters === '') ?
                                <h6>Loading</h6> :
                                <>
                                    <br/>
                                    <Form>
                                        <Form.Group>
                                            <Form.Label><b>Select scooter</b></Form.Label>
                                            <Form.Select
                                                onChange={(e) => {
                                                    let scooter = e.target.value.split(',')
                                                    setScooterCurrentId(scooter[0]);
                                                    setScooterCurrentAvailability(scooter[1])
                                                }}
                                            >
                                                <option value="none" key="none">Select a scooter...</option>
                                                {scooters.map((scooter, idx) => (
                                                    <option value={[scooter.scooterId, scooter.available]} key={idx}>
                                                        Scooter {scooter.softScooterId}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                        <br/>
                                        <Form.Group>
                                            <Form.Label><b>Select availability</b></Form.Label>
                                            <Form.Select
                                                onChange={(e) => {
                                                    setScooterAvailability(e.target.value)
                                                }}
                                            >
                                                <option value="none" key="none">Select availability...
                                                </option>
                                                {(scooterCurrentId === "") ? null :
                                                    <>
                                                        {["Make Available", "Make Unavailable"].map((status, idx) => (
                                                            <option value={status} key={idx}>{status}</option>
                                                        ))}
                                                    </>
                                                }
                                            </Form.Select>
                                        </Form.Group>
                                        <br/>
                                        <Form.Group>
                                            <Button style={{float: "right"}} onClick={editScooter}>Save changes</Button>
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