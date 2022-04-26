import React, {useEffect, useState} from "react";
import {Button, Container, Form, InputGroup, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {NotificationManager} from "react-notifications";
import getMapName from "../../getMapName";
import host from '../../host';
import scooterStatus from "../../scooterStatus";
import Cookies from 'universal-cookie';

export default function ManagerScooterManagement() {
    const cookies = new Cookies();
    const [newID, setScooterNewId] = useState('');
    const [createID, setCreateId] = useState('');
    const [createDepo, setCreateDepo] = useState('');
    const [map_locations, setMapLocations] = useState('');
    const [scooters, setScooters] = useState('');

    useEffect(() => {
        fetchScooters();
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

    async function fetchScooters() {
        try {
            let request = await fetch(host + "api/admin/Scooters", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let response = await request.json();
            setScooters(response.sort((a, b) => a.softScooterId - b.softScooterId));
        } catch (error) {
            console.error(error);
        }
    }

    async function editScooter(id, mode, availability = '', location = '') {
        const json = {}
        switch (mode) {
            case 1:
                if (location === '' || location === 'none') {
                    return;
                } else {
                    json["depoId"] = location;
                }
                break;
            case 2:
                if (!(newID.match(/^\d+$/))) {
                    NotificationManager.error("Scooter ID must be an integer.", "Error");
                    return;
                } else {
                    json["softScooterId"] = newID;
                }
                break;
            default:
                json["available"] = !availability;
                break;
        }

        try {
            let request = await fetch(host + `api/admin/Scooters/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify(json),
                mode: "cors"
            });
            let response = await request;
            if (response.status === 422) {
                NotificationManager.error("Scooter ID is already taken.", "Error");
            } else if (response.status !== 200) {
                NotificationManager.error("Could not modify scooter.", "Error");
            } else {
                NotificationManager.success("Modified scooter.", "Success");
            }
        } catch (error) {
            console.error(error);
        }
        await fetchScooters();
    }

    async function createScooter() {
        if (!(createID.match(/^\d+$/))) {
            NotificationManager.error("Scooter ID must be an integer.", "Error");
            return;
        }
        for (let scooter in scooters) {
            if (createID === scooter.softScooterId) {
                NotificationManager.error("Scooter ID already exists.", "Error");
                return;
            }
        }
        if (createDepo === '' || createDepo === 'none') {
            NotificationManager.error("Depot selection cannot be empty.", "Error");
            return;
        }
        try {
            let request = await fetch(host + `api/admin/Scooters`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    "softScooterId": parseInt(createID),
                    "name": createID,
                    "depoId": parseInt(createDepo),
                    "available": true
                }),
                mode: "cors"
            });
            let response = await request;
            if (response.status !== 200) {
                NotificationManager.error("Could not create scooter.", "Error");
            } else {
                NotificationManager.success("Created scooter.", "Success");
            }
        } catch (error) {
            console.error(error);
        }
        await fetchScooters();
    }

    async function deleteScooter(id) {
        try {
            let request = await fetch(host + `api/admin/Scooters/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let response = await request;
            if (response.status !== 200) {
                NotificationManager.error("Could not delete scooter.", "Error");
            } else {
                NotificationManager.success("Deleted scooter.", "Success");
            }
        } catch (error) {
            console.error(error);
        }
        await fetchScooters();
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home</a> > <b>
                <a className="breadcrumb-current" href="/scooter-management">Scooter Management</a></b>
            </p>
            <h3 id="pageName">Scooter Management</h3>
            <hr id="underline"/>
            <br/>
            <Container>
                {(scooters === '') ?
                    <p>Loading scooters...</p> :
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Scooter ID</th>
                            <th>Availability</th>
                            <th>Status</th>
                            <th>Location</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {scooters.map((scooter, idx) => (
                            <tr key={idx}>
                                <td>
                                    {scooter.softScooterId}
                                    <InputGroup>
                                        <input onInput={e => setScooterNewId(e.target.value)}/>
                                    </InputGroup>
                                    <Button onClick={() => {
                                        if (scooter.softScooterId !== parseInt(newID)) {
                                            editScooter(scooter.scooterId, 2);
                                        } else {
                                            NotificationManager.error("Scooter ID cannot be the same", "Error");
                                        }
                                    }}>
                                        Change Scooter ID
                                    </Button>
                                </td>
                                <td>
                                    {(scooter.available ?
                                            <Button variant="danger"
                                                    onClick={() => editScooter(scooter.scooterId, 0, scooter.available)}>
                                                Make Unavailable
                                            </Button> :
                                            <Button variant="success"
                                                    onClick={() => editScooter(scooter.scooterId, 0, scooter.available)}>
                                                Make Available
                                            </Button>
                                    )}
                                </td>
                                <td>{scooterStatus[scooter.scooterStatus]}</td>
                                <td>
                                    {(map_locations === "") ?
                                        <h5>Loading map locations...</h5> :
                                        <>
                                            <p>{getMapName(idx, scooters, map_locations)}</p>
                                            <Form>
                                                <Form.Select defaultValue="none" onChange={(e) => {
                                                    if (e.target.value !== scooter.depoId.toString()) {
                                                        editScooter(scooter.scooterId, 1, '', e.target.value);
                                                    }
                                                }}>
                                                    <option value="none" key="none" disabled hidden>
                                                        Select location
                                                    </option>
                                                    {map_locations.map((location, idx) => (
                                                        <option value={location.depoId} key={idx}>
                                                            {String.fromCharCode(parseInt(location.depoId + 64))} - {location.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form>
                                        </>
                                    }
                                </td>
                                <td>
                                    <Button
                                        onClick={() => deleteScooter(scooter.scooterId)} variant="danger">
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        <tr key="create">
                            <td>
                                <InputGroup>
                                    <input type="text" placeholder="Enter ID"
                                           onInput={e => setCreateId(e.target.value)}/>
                                </InputGroup>
                            </td>
                            <td>Available (by default)</td>
                            <td>In Depot (by default)</td>
                            <td>
                                {(map_locations === "") ?
                                    <h5>Loading map locations...</h5> :
                                    <Form>
                                        <Form.Select defaultValue="none" onChange={(e) => {
                                            setCreateDepo(e.target.value);
                                        }}>
                                            <option value="none" key="none" disabled hidden>
                                                Select location
                                            </option>
                                            {map_locations.map((location, idx) => (
                                                <option value={location.depoId} key={idx}>
                                                    {String.fromCharCode(parseInt(location.depoId + 64))} - {location.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form>
                                }
                            </td>
                            <td>
                                <Button onClick={createScooter} variant="success">Create</Button>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                }
            </Container>
        </>
    );
};