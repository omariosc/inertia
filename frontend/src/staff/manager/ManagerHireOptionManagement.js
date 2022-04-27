import React, {useEffect, useState} from "react";
import {Button, Container, Form, InputGroup, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {NotificationManager} from "react-notifications";
import host from "../../host";
import Cookies from 'universal-cookie';

export default function ManagerHireOptionManagement() {
    const cookies = new Cookies();
    const [hireOptions, setHireOptions] = useState('');
    const [newDuration, setNewDuration] = useState('');
    const [newName, setNewName] = useState('');
    const [newCost, setNewCost] = useState('');
    const [createDuration, setCreateDuration] = useState('');
    const [createName, setCreateName] = useState('');
    const [createCost, setCreateCost] = useState('');

    useEffect(() => {
        fetchHirePeriods();
    }, []);

    async function fetchHirePeriods() {
        try {
            let request = await fetch(host + "api/HireOptions", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            setHireOptions((await request.json()).sort((a, b) => a.cost - b.cost));
        } catch (error) {
            console.error(error);
        }
    }

    async function editHireOption(id, mode) {
        const json = {};
        switch (mode) {
            case 1:
                if (newName === '') {
                    NotificationManager.error("Hire option name cannot be empty.", "Error");
                    return;
                } else {
                    json["name"] = newName;
                }
                break;
            case 2:
                if (!(newCost.match(/^\d+(\.\d{0,2})?$/))) {
                    NotificationManager.error("Cost must be a valid price.", "Error");
                    return;
                } else if (parseFloat(newCost) <= 0) {
                    NotificationManager.error("Cost must be greater than 0.", "Error");
                    return;
                } else {
                    json["cost"] = parseFloat(newCost);
                }
                break;
            default:
                if (!(newDuration.match(/^\d+$/))) {
                    NotificationManager.error("Duration must be an integer.", "Error");
                    return;
                } else if (parseFloat(createDuration) <= 0) {
                    NotificationManager.error("Duration must be at least 1.", "Error");
                    return;
                } else {
                    json["durationInHours"] = parseInt(newDuration);
                }
                break;
        }
        try {
            let request = await fetch(host + `api/admin/HireOptions/${id}`, {
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
                NotificationManager.error("Could not modify hire option.", "Error");
            } else {
                NotificationManager.success("Modified hire option.", "Success");
            }
        } catch (error) {
            console.error(error);
        }
        await fetchHirePeriods();
    }

    async function createHireOption() {
        if (!(createDuration.match(/^\d+$/))) {
            NotificationManager.error("Duration must be an integer.", "Error");
            return;
        } else if (parseFloat(createDuration) <= 0) {
            NotificationManager.error("Duration must be at least 1.", "Error");
            return;
        }
        if (createName === '') {
            NotificationManager.error("Hire option name cannot be empty.", "Error");
            return;
        }
        if (!(createCost.match(/^\d+(\.\d{0,2})?$/))) {
            NotificationManager.error("Cost must be a valid price.", "Error");
            return;
        } else if (parseFloat(newCost) <= 0) {
            NotificationManager.error("Cost must be greater than 0.", "Error");
            return;
        }
        try {
            let request = await fetch(host + `api/admin/HireOptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    "durationInHours": createDuration,
                    "name": createName,
                    "cost": createCost
                }),
                mode: "cors"
            });
            let response = await request;
            if (response.status !== 200) {
                NotificationManager.error("Could not create hire option.", "Error");
            } else {
                NotificationManager.success("Created hire option.", "Success");
            }
        } catch (error) {
            console.error(error);
        }
        await fetchHirePeriods();
    }

    async function deleteHireOption(id) {
        try {
            let request = await fetch(host + `api/admin/HireOptions/${id}`, {
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
                NotificationManager.error("Could not delete hire option.", "Error");
            } else {
                NotificationManager.success("Deleted hire option.", "Success");
            }
        } catch (error) {
            console.error(error);
        }
        await fetchHirePeriods();
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home</a> > <b>
                <a className="breadcrumb-current" href="/hire-option-management">Hire Option Management</a></b>
            </p>
            <h3 id="pageName">Hire Option Management</h3>
            <hr id="underline"/>
            <Container>
                {(hireOptions === '') ?
                    <p>Loading hire options...</p> :
                    <Table className="table-formatting">
                        <thead>
                        <tr>
                            <th>Duration (hours)</th>
                            <th>Name</th>
                            <th>Cost (£)</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {hireOptions.map((hireOption, idx) => (
                            <tr key={idx}>
                                <td>
                                    <div className="sameLine">
                                        <div className="maxWidth"> {hireOption.durationInHours}
                                        </div>

                                        <InputGroup >
                                            <input  type="number" onInput={e => setNewDuration(e.target.value)} size={12}/>
                                        </InputGroup>
                                        <Button className="buttonPaddingDuration" onClick={() => {
                                            if (hireOption.durationInHours !== parseInt(newDuration)) {
                                                editHireOption(hireOption.hireOptionId, 0);
                                            } else {
                                                NotificationManager.error("Duration cannot be the same.", "Error");
                                            }
                                        }}>
                                            Edit
                                        </Button>
                                    </div>
                                </td>
                                <td>
                                    <div className="sameLine">
                                        <div className="maxWidthLong"> {hireOption.name} </div>
                                        <InputGroup>
                                            <input type="text" onInput={e => setNewName(e.target.value)} size={12}/>
                                        </InputGroup>
                                        <Button className="buttonPadding" onClick={() => {
                                            if (hireOption.name !== newName) {
                                                editHireOption(hireOption.hireOptionId, 1);
                                            } else {
                                                NotificationManager.error("Name cannot be the same.", "Error");
                                            }
                                        }}>
                                            Edit
                                        </Button>
                                    </div>
                                </td>
                                <td>
                                    <div className="sameLine">
                                        <div className="maxWidthLong">
                                            {hireOption.cost}
                                        </div>

                                        <InputGroup>
                                            <input type="price" onInput={e => setNewCost(e.target.value)} size={12}/>
                                        </InputGroup>
                                        <Button className="buttonPadding" onClick={() => {
                                            if (parseFloat(hireOption.cost) !== parseFloat(newCost)) {
                                                editHireOption(hireOption.hireOptionId, 2);
                                            } else {
                                                NotificationManager.error("Cost cannot be the same.", "Error");
                                            }
                                        }}>
                                            Edit
                                        </Button>
                                    </div>
                                </td>
                                <td>
                                    <Button
                                        onClick={() => deleteHireOption(hireOption.hireOptionId)}
                                        variant="danger">
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        <tr key="create">
                            <td><Form.Control type="number" placeholder="Enter duration value"
                                              onInput={e => setCreateDuration(e.target.value)}/></td>
                            <td><Form.Control type="text" placeholder="Enter name"
                                              onInput={e => setCreateName(e.target.value)}/></td>
                            <td><Form.Control type="price" placeholder="Enter cost"
                                              onInput={e => setCreateCost(e.target.value)}/></td>
                            <td><Button onClick={createHireOption} variant="success">Create</Button></td>
                        </tr>
                        </tbody>
                    </Table>
                }
            </Container>
        </>
    );
};