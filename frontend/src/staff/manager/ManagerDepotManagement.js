import React, {useEffect, useState} from "react";
import {Button, Container, InputGroup, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import host from "../../host";
import Cookies from 'universal-cookie';

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
                if (newLatitude === '') {
                    alert("Enter a valid latitude value.");
                    return;
                } else {
                    json["latitude"] = parseFloat(newLatitude);
                }
                break;
            case 2:
                if (newLongitude === '') {
                    alert("Enter a valid longitude value.");
                    return;
                } else {
                    json["longitude"] = parseFloat(newLongitude);
                }
                break;
            default:
                if (newName === '') {
                    alert("Depot name cannot be empty.")
                    return;
                } else {
                    json["name"] = newName;
                }
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
                alert("Could not modify depot.");
            }

        } catch (error) {
            console.error(error);
        }
        await fetchDepots();
    }

    async function createDepot() {
        if (createName === '') {
            alert("Depot name cannot be empty.")
            return;
        }
        if (createLatitude === '') {
            alert("Enter a valid latitude value.");
            return;
        }
        if (createLongitude === '') {
            alert("Enter a valid longitude value.");
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
                    "latitude": createLatitude,
                    "longitude": createLongitude
                }),
                mode: "cors"
            });
            let response = await request;
            if (response.status !== 200) {
                alert("Could not create depot.");
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
                alert("Could not delete depot.");
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
            <br/>
            <Container>
                {(depots === '') ?
                    <p>Loading depots...</p> :
                    <>
                        {(depots.length === 0) ?
                            <p>There are no hire options.</p> :
                            <div className="scroll" style={{maxHeight: "40rem"}}>
                                <Table striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th>Depot ID</th>
                                        <th>Name</th>
                                        <th>Latitude</th>
                                        <th>Longitude</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {depots.map((depot, idx) => (
                                        <tr key={idx}>
                                            <td>{depot.depoId}</td>
                                            <td>
                                                <div className="sameLine">
                                                    <div className="maxWidthLongDep"> {depot.name} </div>
                                                <InputGroup>
                                                    <input type="text" onInput={e => setNewName(e.target.value)} size={12}/>
                                                </InputGroup>
                                                <Button className="buttonPaddinDepo" onClick={() => {
                                                    if (depot.name !== newName) {
                                                        editDepot(depot.depoId, 0);
                                                    } else {
                                                        alert("Name cannot be the same.");
                                                    }
                                                }}>
                                                    Edit
                                                </Button>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="sameLine">
                                                    <div className="maxWidthDepo">{depot.latitude} </div>
                                                <InputGroup>
                                                    <input type="text" onInput={e => setNewLatitude(e.target.value)} size={12}/>
                                                </InputGroup>
                                                <Button className="buttonPadding" onClick={() => {
                                                    if (parseFloat(depot.latitude) !== parseFloat(newLatitude)) {
                                                        editDepot(depot.depoId, 1);
                                                    } else {
                                                        alert("Latitude cannot be the same.");
                                                    }
                                                }}>
                                                    Edit
                                                </Button>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="sameLine">
                                                    <div className="maxWidthDepo"> {depot.longitude} </div>
                                                <InputGroup>
                                                    <input type="text" onInput={e => setNewLongitude(e.target.value)} size={12}/>
                                                </InputGroup>
                                                <Button className="buttonPadding" onClick={() => {
                                                    if (parseFloat(depot.longitude) !== parseFloat(newLongitude)) {
                                                        editDepot(depot.depoId, 2);
                                                    } else {
                                                        alert("Longitude cannot be the same.");
                                                    }
                                                }}>
                                                    Edit
                                                </Button>
                                                </div>
                                            </td>
                                            <td>
                                                <Button
                                                    onClick={() => deleteDepot(depot.depoId)} variant="danger">
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr key="create">
                                        <td>{depots.length + 1}</td>
                                        <td>
                                            <InputGroup>
                                                <input type="text" placeholder="Enter name"
                                                       onInput={e => setCreateName(e.target.value)}/>
                                            </InputGroup>
                                        </td>
                                        <td>
                                            <InputGroup>
                                                <input type="text" placeholder="Enter latitude value"
                                                       onInput={e => setCreateLatitude(e.target.value)}/>
                                            </InputGroup>
                                        </td>
                                        <td>
                                            <InputGroup>
                                                <input type="text" placeholder="Enter longitude value"
                                                       onInput={e => setCreateLongitude(e.target.value)}/>
                                            </InputGroup>
                                        </td>
                                        <td>
                                            <Button onClick={createDepot} variant="success">Create</Button>
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