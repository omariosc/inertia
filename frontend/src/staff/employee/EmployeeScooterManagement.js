import React, {useEffect, useState} from "react";
import {Button, Container, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import scooterStatus from "../../scooterStatus";
import host from '../../host';
import Cookies from 'universal-cookie';

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
            setScooters(await request.json());
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
            alert("Changed scooter details.");
            await fetchScooters();
        } catch (error) {
            console.error(error);
        }
        await fetchScooters();
    }

    return (
        <>
            <h1 id={"pageName"}>Scooter Management</h1>
            <br/>
            <Container>
                <h3>View Scooters</h3>
                <br/>
                <div className="scroll" style={{maxHeight: "40rem", overflowX: "hidden"}}>
                    <Table striped bordered hover style={{tableLayout: 'fixed'}}>
                        <thead>
                        <tr>
                            <th>Scooter ID</th>
                            <th>Availability</th>
                            <th>Status</th>
                            <th>Location</th>
                            <th>Change Availability</th>
                        </tr>
                        </thead>
                        <tbody>
                        {(scooters === '') ? null :
                            scooters.map((scooter, idx) => (
                                <tr key={idx}>
                                    <td>{scooter.softScooterId}</td>
                                    <td>{(scooter.available ? "Available" : "Unavailable")}</td>
                                    <td>{scooterStatus[scooter.scooterStatus]}</td>
                                    <td>
                                        {(map_locations === "") ?
                                            <h5>Loading map locations...</h5> :
                                            <>
                                                {String.fromCharCode(scooter.depoId + 64)} - {map_locations[scooter.depoId - 1].name}
                                            </>
                                        }
                                    </td>
                                    <td>
                                        <Button onClick={() => editScooter(scooter.scooterId, scooter.available)}>
                                            {(scooter.available ? "Make Unavailable" : "Make Available")}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </>
    );
};