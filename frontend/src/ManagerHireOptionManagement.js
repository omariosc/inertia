import React, {useEffect, useState} from "react";
import {Container, InputGroup, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import host from "./host";
import Cookies from 'universal-cookie';
import './StaffInterface.css';

export default function HireOptionManagement() {
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
            setHireOptions(await request.json());
        } catch (error) {
            console.error(error);
        }
    }

    async function editHireOption(id, mode) {
        const json = {}
        switch (mode) {
            case 1:
                if (newName === '') {
                    alert("Hire option name cannot be empty.")
                    return;
                } else {
                    json["name"] = newName;
                }
                break;
            case 2:
                if (!(newCost.match(/^\d+(\.\d{0,2})?$/))) {
                    alert("Cost must be an integer.");
                    return;
                } else if (parseFloat(newCost) <= 0) {
                    alert("Cost must be greater than 0.");
                    return;
                } else {
                    json["cost"] = parseFloat(newCost);
                }
                break;
            default:
                if (!(newDuration.match(/^\d+$/))) {
                    alert("Duration must be an integer.");
                    return;
                } else if (parseFloat(createDuration) <= 0) {
                    alert("Duration must be at least 1.");
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
            if (response.status === 200) {
                alert("Modified hire option");
            } else {
                alert("Could not modify hire option.");
            }
        } catch (error) {
            console.error(error);
        }
        await fetchHirePeriods();
    }

    async function createHireOption() {
        if (!(createDuration.match(/^\d+$/))) {
            alert("Duration must be an integer.");
            return;
        } else if (parseFloat(createDuration) <= 0) {
            alert("Duration must be at least 1.");
            return;
        }
        if (createName === '') {
            alert("Hire option name cannot be empty.")
            return;
        }
        if (!(createCost.match(/^\d+(\.\d{0,2})?$/))) {
            alert("Cost must be a number.");
            return;
        } else if (parseFloat(newCost) <= 0) {
            alert("Cost must be greater than 0.");
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
            if (response.status === 200) {
                alert("Created new hire option");
            } else {
                alert("Could not create hire option.");
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
            if (response.status === 200) {
                alert("Deleted hire option");
            } else {
                alert("Could not delete hire option.");
            }
        } catch (error) {
            console.error(error);
        }
        await fetchHirePeriods();
    }

    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Hire Option Management</h1>
            <br/>
            <Container>
                {(hireOptions === '') ?
                    <h6>Loading...</h6> :
                    <>
                        {(hireOptions.length === 0) ?
                            <h6>There are no hire options.</h6> :
                            <div className="scroll" style={{maxHeight: "40rem"}}>
                                <Table striped bordered hover>
                                    <thead>
                                    <tr>
                                        <th>Hire Option ID</th>
                                        <th>Duration (hours)</th>
                                        <th>Name</th>
                                        <th>Cost (£)</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {hireOptions.map((hireOption, idx) => (
                                        <tr key={idx}>
                                            <td>{hireOption.hireOptionId}</td>
                                            <td>
                                                {hireOption.durationInHours}
                                                <InputGroup>
                                                    <input type="number" placeholder="Modify duration"
                                                           onInput={e => setNewDuration(e.target.value)}/>
                                                </InputGroup>
                                                <a onClick={() => {
                                                    if (hireOption.durationInHours !== parseInt(newDuration)) {
                                                        editHireOption(hireOption.hireOptionId, 0);
                                                    } else {
                                                        alert("Duration cannot be the same.");
                                                    }
                                                }}
                                                   href="#/manager-change-hire-option-duration">
                                                    Change Duration
                                                </a>
                                            </td>
                                            <td>
                                                {hireOption.name}
                                                <InputGroup>
                                                    <input type="text" placeholder="Modify name"
                                                           onInput={e => setNewName(e.target.value)}/>
                                                </InputGroup>
                                                <a onClick={() => {
                                                    if (hireOption.name !== newName) {
                                                        editHireOption(hireOption.hireOptionId, 1);
                                                    } else {
                                                        alert("Name cannot be the same.");
                                                    }
                                                }}
                                                   href="#/manager-change-hire-option-name">
                                                    Change Name
                                                </a>
                                            </td>
                                            <td>
                                                {hireOption.cost}
                                                <InputGroup>
                                                    <input type="price" placeholder="Modify cost"
                                                           onInput={e => setNewCost(e.target.value)}/>
                                                </InputGroup>
                                                <a onClick={() => {
                                                    if (parseFloat(hireOption.cost) !== parseFloat(newCost)) {
                                                        editHireOption(hireOption.hireOptionId, 2);
                                                    } else {
                                                        alert("Cost cannot be the same.");
                                                    }
                                                }}
                                                   href="#/manager-change-hire-option-cost">
                                                    Change Cost
                                                </a>
                                            </td>
                                            <td>
                                                <a onClick={() => deleteHireOption(hireOption.hireOptionId)}
                                                   href="#/manager-delete-hire-option" color="red">
                                                    Delete
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr key="create">
                                        <td>{hireOptions.length + 1}</td>
                                        <td>
                                            <InputGroup>
                                                <input type="number" placeholder="Enter new duration"
                                                       onInput={e => setCreateDuration(e.target.value)}/>
                                            </InputGroup>
                                        </td>
                                        <td>
                                            <InputGroup>
                                                <input type="text" placeholder="Enter new name"
                                                       onInput={e => setCreateName(e.target.value)}/>
                                            </InputGroup>
                                        </td>
                                        <td>
                                            <InputGroup>
                                                <input type="price" placeholder="Enter new cost"
                                                       onInput={e => setCreateCost(e.target.value)}/>
                                            </InputGroup>
                                        </td>
                                        <td>
                                            <a onClick={createHireOption}
                                               href="#/manager-create-hire-option" color="green">
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