import React, {useEffect, useState} from "react";
import {Button, Container, Form, Table} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import Cookies from 'universal-cookie';
import host from "../../host";

export default function ManagerDepotManagement() {
    const cookies = new Cookies();
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
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
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
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
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

    async function deleteDepot(id) {
        try {
            let request = await fetch(host + `api/admin/Depos/${id}`, {
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
                <a className="breadcrumb-list" href="/dashboard">Home</a> > <b>
                <a className="breadcrumb-current" href="/depot-management">Depot Management</a></b>
            </p>
            <h3 id="pageName">Depot Management</h3>
            <hr id="underline"/>
            <Container>
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
                <Table>
                    <tbody>
                    <tr>
                        <td><Form.Control type="text" placeholder="Enter name"
                                          onInput={e => setCreateName(e.target.value)}/></td>
                        <td><Form.Control type="text" placeholder="Enter latitude value"
                                          onInput={e => setCreateLatitude(e.target.value)}/></td>
                        <td><Form.Control type="text" placeholder="Enter longitude value"
                                          onInput={e => setCreateLongitude(e.target.value)}/></td>
                        <td><Button onClick={createDepot} variant="success">Create</Button></td>
                    </tr>
                    </tbody>
                </Table>
            </Container>
        </>
    );
};