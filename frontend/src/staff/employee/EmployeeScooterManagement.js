/*
	Purpose of file: Display a list of all scooters and allow
	each one to have its details modified by a member of staff
*/

import React, {useEffect, useState} from "react";
import {Button, Container, Table} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import { useAccount } from '../../authorize';
import host from '../../host';
import scooterStatus from "../../scooterStatus";

/**
 * Returns the employee scooter management page, displays
 * list of scooters
 */
export default function EmployeeScooterManagement() {
    const [account] = useAccount();
    const [map_locations, setMapLocations] = useState('');
    const [scooters, setScooters] = useState('');

    useEffect(() => {
        fetchScooters();
        fetchLocations();
    }, []);

		/**
		 * Get list of locations of depots from the backend server
		 */
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

		/**
		 * Get list of scooter details from the backend server
		 */
    async function fetchScooters() {
        try {
            let request = await fetch(host + "api/admin/Scooters", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                mode: "cors"
            });
            setScooters((await request.json()).sort((a, b) => a.softScooterId - b.softScooterId));
        } catch (error) {
            console.error(error);
        }
    }

		/**
		 * Changes details of the scooter ID provided by updating
		 * the backend server with the new information
		 */
    async function editScooter(id, availability) {
        try {
            await fetch(host + `api/admin/Scooters/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
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
            <Container className="responsive-table">
                {(scooters === '') ? <p>Loading scooters...</p> :
                    (scooters.length !== 0) ?
                        <Table className="table-formatting">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Availability</th>
                                <th className="minWidthFieldSmall">Status</th>
                                <th className="minWidthFieldSmall">Location</th>
                                <th className="minWidthFieldSmall">Change Availability</th>
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
                                            String.fromCharCode(scooters[idx].depoId + 64) + ' - ' + map_locations[scooters[idx].depoId - 1].name
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