import React, {useEffect, useState} from "react";
import {Button, Container, Table} from "react-bootstrap";
import getMapName from "../../getMapName";
import {NotificationManager} from "react-notifications";
import Cookies from 'universal-cookie';
import host from '../../host';
import scooterStatus from "../../scooterStatus";

export default function EmployeeScooterManagement() {
    const cookies = new Cookies();
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
            let availableScooters = [];
            {response.map((scooter, idx) => {
                if (getMapName(idx, scooters, map_locations) !== 'Depot longer exists') {
                    availableScooters.push(scooter)
                }
            })}
            setScooters(availableScooters.sort((a, b) => a.softScooterId - b.softScooterId));
        } catch (error) {
            console.error(error);
        }
    }

    async function editScooter(id, availability) {
        try {
            await fetch(host + `api/admin/Scooters/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    "available": !availability
                }),
                mode: "cors"
            });
            NotificationManager.success("Modified scooter.", "Success");
            await fetchScooters();
        } catch (error) {
            console.error(error);
        }
        await fetchScooters();
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/home">Home</a> > <b>
                <a className="breadcrumb-current" href="/scooter-management">Scooter Management</a></b>
            </p>
            <h3 id="pageName">Scooter Management</h3>
            <hr id="underline"/>
            <Container>
                {(scooters === '') ? <p>Loading scooters...</p> :
                    (scooters.length !== 0) ?
                        <Table className="table-formatting">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Availability</th>
                                <th>Status</th>
                                <th>Location</th>
                                <th>Change Availability</th>
                            </tr>
                            </thead>
                            <tbody>
                            {scooters.map((scooter, idx) => (
                                <tr key={idx}>
                                    <td>{scooter.softScooterId}</td>
                                    <td>{(scooter.available ? "Available" : "Unavailable")}</td>
                                    <td>{scooterStatus[scooter.scooterStatus]}</td>
                                    <td>
                                        {(map_locations === "") ?
                                            <p>Loading map locations...</p> :
                                            getMapName(idx, scooters, map_locations)
                                        }
                                    </td>
                                    <td>
                                        {(scooter.available ?
                                                <Button variant="danger"
                                                        onClick={() => editScooter(scooter.scooterId, scooter.available)}>
                                                    Make Unavailable
                                                </Button> :
                                                <Button variant="success"
                                                        onClick={() => editScooter(scooter.scooterId, scooter.available)}>
                                                    Make Available
                                                </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table> :
                        <p>There are no scooters.</p>
                }
            </Container>
            <br/>
        </>
    );
};