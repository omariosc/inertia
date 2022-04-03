import React, {useEffect, useState} from "react";
import {Container, Form, InputGroup, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import host from './host';
import Cookies from 'universal-cookie';
import './StaffInterface.css';

export default function ScooterManagement({map_locations}) {
    const cookies = new Cookies();
    const [scooters, setScooters] = useState('');
    const [newID, setScooterNewId] = useState('');
    const [createID, setCreateId] = useState('');
    const [createDepo, setCreateDepo] = useState('');
    const scooterStatus = ["In Depot", "Ongoing Order", "Pending Return", "Unavailable By Staff"];

    useEffect(() => {
        fetchScooters();
    }, []);

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
            setScooters(await request.json());
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
                    alert("Scooter ID must be an integer.");
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
                alert("Scooter ID is already taken.");
            } else if (response.status === 200) {
                alert("Modified scooter.");
            } else {
                alert("Could not modify scooter.");
            }
        } catch (error) {
            console.error(error);
        }
        await fetchScooters();
    }

    async function createScooter() {
        if (!(createID.match(/^\d+$/))) {
            alert("Scooter ID must be an integer.");
            return;
        }
        for (let scooter in scooters) {
            if (createID === scooter.softScooterId) {
                alert("Scooter ID already exists.")
                return;
            }
        }
        if (createDepo === '' || createDepo === 'none') {
            alert("Depot selection cannot be empty.")
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
            if (response.status === 200) {
                alert("Created new scooter.");
            } else {
                alert("Could not create scooter.");
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
            if (response.status === 200) {
                alert("Deleted scooter.");
            } else {
                alert("Could not delete scooter.");
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
                {(scooters === '') ?
                    <h6>Loading scooters...</h6> :
                    <>
                        {(scooters.length === 0) ?
                            <h6>There are no scooters.</h6> :
                            <div className="scroll" style={{maxHeight: "40rem"}}>
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
                                                    <input placeholder="Enter new scooter ID"
                                                           onInput={e => setScooterNewId(e.target.value)}/>
                                                </InputGroup>
                                                <a onClick={() => {
                                                    if (scooter.scooterId !== parseInt(newID)) {
                                                        editScooter(scooter.scooterId, 2);
                                                    } else {
                                                        alert("Scooter ID cannot be the same");
                                                    }
                                                }}
                                                   href="#/manager-change-id">
                                                    Change ID
                                                </a>
                                            </td>
                                            <td>
                                                <p>{(scooter.available ? "Available" : "Unavailable")}</p>
                                                <a onClick={() => editScooter(scooter.scooterId, 0, scooter.available)}
                                                   href="#/manager-change-availability">
                                                    {(scooter.available ? "Make Unavailable" : "Make Available")}
                                                </a>
                                            </td>
                                            <td>{scooterStatus[scooter.scooterStatus]}</td>
                                            <td>
                                                <p>{String.fromCharCode(scooter.depoId + 64)} - {map_locations[scooter.depoId - 1].name}</p>
                                                <Form>
                                                    <Form.Select
                                                        onChange={(e) => {
                                                            if (e.target.value !== scooter.depoId.toString()) {
                                                                editScooter(scooter.scooterId, 1, '', e.target.value);
                                                            }
                                                        }}
                                                    >
                                                        <option value="none" key="none">Select location...</option>
                                                        {map_locations.map((location, idx) => (
                                                            <option value={location.depoId} key={idx}>
                                                                {String.fromCharCode(parseInt(location.depoId + 64))} - {location.name}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form>
                                            </td>
                                            <td>
                                                <a onClick={() => deleteScooter(scooter.scooterId)}
                                                   href="#/manager-delete-scooter" color="red">
                                                    Delete
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr key="create">
                                        <td>
                                            <InputGroup>
                                                <input type="text" placeholder="Enter new ID"
                                                       onInput={e => setCreateId(e.target.value)}/>
                                            </InputGroup>
                                        </td>
                                        <td>Available (by default)</td>
                                        <td>In Depot (by default)</td>
                                        <td>
                                            <Form>
                                                <Form.Select
                                                    onChange={(e) => {
                                                        setCreateDepo(e.target.value);
                                                    }}
                                                >
                                                    <option value="none" key="none">Select location...</option>
                                                    {map_locations.map((location, idx) => (
                                                        <option value={location.depoId} key={idx}>
                                                            {String.fromCharCode(parseInt(location.depoId + 64))} - {location.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form>
                                        </td>
                                        <td>
                                            <a onClick={createScooter}
                                               href="#/manager-create-scooter" color="green">
                                                Create New
                                            </a>
                                        </td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </div>
                        }
                    </>
                }
            </Container>
        </>
    );
};