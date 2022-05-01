/*
	Purpose of file: Display the current depots to the manager
	and allow them to add, remove or change a depot
*/

import React, {useEffect, useState} from "react";
import {Button, Container, Form, Table} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import { useAccount } from '../../authorize';
import host from "../../host";
import {useNavigate} from "react-router-dom";

/**
 * Renders the manager depot management, a list of all current
 * depots available
 * @returns The manager depot management page
 */
export default function ManagerDepotManagement() {
    const navigate = useNavigate();
    const [account] = useAccount();
    const [depots, setDepots] = useState('');
    const [newName, setNewName] = useState('');
    const [newLatitude, setNewLatitude] = useState('');
    const [newLongitude, setNewLongitude] = useState('');
    const [createName, setCreateName] = useState('');
    const [createLatitude, setCreateLatitude] = useState('');
    const [createLongitude, setCreateLongitude] = useState('');

    useEffect(() => {
        fetchDepots();
    }, []);

		/**
		 * Gets list of current depots from backend server
		 */
    async function fetchDepots() {
        try {
            let request = await fetch(host + "api/Depos", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                mode: "cors"
            });
            let response = await request.json();
            setDepots(response);
        } catch (error) {
            console.error(error);
        }
    }

		/**
		 * Edits the details of a specific depot with the provided ID
		 * and updates the backend server
		 * @param {number} id The ID of the depot to be edited
		 * @param {number} mode 1 to change latitude, 2 to change longitude
		 * @returns Null if there is some error during the editing
		 */
    async function editDepot(id, mode) {
        const json = {};
        switch (mode) {
            case 1:
                if (newLatitude === '' || isNaN(parseFloat(newLatitude))) {
                    NotificationManager.error("Enter a valid latitude value.", "Error");
                    return;
                }
                if (parseFloat(newLatitude) >= 90 || parseFloat(newLatitude) <= -90) {
                    NotificationManager.error("Enter a valid latitude value.", "Error");
                    return;
                }
                json["latitude"] = newLatitude;
                break;
            case 2:
                if (newLongitude === '' || isNaN(parseFloat(newLongitude))) {
                    NotificationManager.error("Enter a valid longitude value.", "Error");
                    return;
                }
                if (parseFloat(newLongitude) >= 180 || parseFloat(newLongitude) <= -180) {
                    NotificationManager.error("Enter a valid longitude value.", "Error");
                    return;
                }
                json["longitude"] = newLongitude;
                break;
            default:
                if (newName === '') {
                    NotificationManager.error("Depot name cannot be empty.", "Error");
                    return;
                }
                json["name"] = newName;
                break;
        }
        try {
            let request = await fetch(host + `api/admin/Depos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                body: JSON.stringify(json),
                mode: "cors"
            });
            let response = await request;
            if (response.status !== 200) {
                NotificationManager.error("Could not modify depot.", "Error");
            } else {
                NotificationManager.success("Modified depot.", "Success");
            }
        } catch (error) {
            console.error(error);
        }
        await fetchDepots();
    }

		/**
		 * Creates a new depot with the information provided in the form
		 * and updates the backend server
		 */
    async function createDepot() {
        if (createName === '') {
            NotificationManager.error("Depot name cannot be empty.", "Error");
            return;
        }
        if (createLatitude === '' || isNaN(parseFloat(createLatitude))) {
            NotificationManager.error("Enter a valid latitude value.", "Error");
            return;
        }
        if (parseFloat(createLatitude) >= 180 || parseFloat(createLatitude) <= -180) {
            NotificationManager.error("Enter a valid latitude value.", "Error");
            return;
        }
        if (createLongitude === '' || isNaN(parseFloat(createLongitude))) {
            NotificationManager.error("Enter a valid longitude value.", "Error");
            return;
        }
        if (parseFloat(createLongitude) >= 180 || parseFloat(createLongitude) <= -180) {
            NotificationManager.error("Enter a valid longitude value.", "Error");
            return;
        }
        try {
            let request = await fetch(host + `api/admin/Depos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                body: JSON.stringify({
                    "name": createName,
                    "address": "",
                    "latitude": parseFloat(createLatitude),
                    "longitude": parseFloat(createLongitude)
                }),
                mode: "cors"
            });
            let response = await request;
            if (response.status !== 200) {
                NotificationManager.error("Could not create depot.", "Error");
            } else {
                NotificationManager.success("Created depot.", "Success");
            }
        } catch (error) {
            console.error(error);
        }
        await fetchDepots();
    }

		/**
		 * Removes a depot from the backend database
		 * @param {*} id The ID of the depot to delete
		 */
    async function deleteDepot(id) {
        try {
            let request = await fetch(host + `api/admin/Depos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                mode: "cors"
            });
            let response = await request;
            if (response.status !== 200) {
                NotificationManager.error("Could not delete depot.", "Error");
            } else {
                NotificationManager.success("Deleted depot.", "Success");
            }
        } catch (error) {
            console.error(error);
        }
        await fetchDepots();
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" onClick={() => {navigate("/dashboard")}}>Home</a> &gt; <b>
                <a className="breadcrumb-current" onClick={() => {navigate("/depot-management")}}>Depot Management</a></b>
            </p>
            <h3 id="pageName">Depot Management</h3>
            <hr id="underline"/>
            <Container className="responsive-table">
                {(depots === '') ?
                    <p>Loading depots...</p> :
                    <Table className="table-formatting">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {depots.map((depot, idx) => (
                            <tr key={idx}>
                                <td>
                                    <div className="sameLine">
                                        <div className="maxWidthLongDep"> {depot.name} </div>
                                        <Form.Control type="text" onInput={e => setNewName(e.target.value)} size={12}/>
                                        <div className="buttonPadding">
                                            <Button onClick={() => {
                                                if (depot.name !== newName) {
                                                    editDepot(depot.depoId, 0);
                                                } else {
                                                    NotificationManager.error("Name cannot be the same.", "Error");
                                                }
                                            }}>
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="sameLine">
                                        <div className="maxWidthDepot">{depot.latitude} </div>
                                        <Form.Control type="text" onInput={e => setNewLatitude(e.target.value)}
                                                      size={12}/>
                                        <div className="buttonPadding">
                                            <Button onClick={() => {
                                                if (parseFloat(depot.latitude) !== parseFloat(newLatitude)) {
                                                    editDepot(depot.depoId, 1);
                                                } else {
                                                    NotificationManager.error("Latitude cannot be the same.", "Error");
                                                }
                                            }}>
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="sameLine">
                                        <div className="maxWidthDepot"> {depot.longitude} </div>
                                        <Form.Control type="text" onInput={e => setNewLongitude(e.target.value)}
                                                      size={12}/>
                                        <div className="buttonPadding">
                                            <Button onClick={() => {
                                                if (parseFloat(depot.longitude) !== parseFloat(newLongitude)) {
                                                    editDepot(depot.depoId, 2);
                                                } else {
                                                    NotificationManager.error("Longitude cannot be the same.", "Error");
                                                }
                                            }}>
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <Button onClick={() => deleteDepot(depot.depoId)} variant="danger">
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                }
                <Table className="table-formatting">
                    <tbody>
                    <tr>
                        <td className="minWidthFieldSmall">
                            <Form.Control type="text" placeholder="Enter name"
                                          onInput={e => setCreateName(e.target.value)}/>
                        </td>
                        <td className="minWidthFieldSmall">
                            <Form.Control type="text" placeholder="Enter latitude value"
                                          onInput={e => setCreateLatitude(e.target.value)}/>
                        </td>
                        <td className="minWidthFieldSmall">
                            <Form.Control type="text" placeholder="Enter longitude value"
                                          onInput={e => setCreateLongitude(e.target.value)}/>
                        </td>
                        <td>
                            <Button onClick={createDepot} variant="success">Create</Button>
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </Container>
        </>
    );
};