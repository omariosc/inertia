import React from "react";
import {DropdownButton, Dropdown, Button, InputGroup, Table} from "react-bootstrap";
import './StaffInterface.css'

function ScooterManagement() {
    const map_locations = [
        ["Trinity Centre", [53.798351, -1.545100], "A"],
        ["Train Station", [53.796770, -1.540510], "B"],
        ["Merrion Centre", [53.801270, -1.543190], "C"],
        ["Leeds General Infirmary Hospital", [53.802509, -1.552887], "D"],
        ["UoL Edge Sports Centre", [53.804167, -1.553208], "E"],
    ]
    const scooters = [
        [100, "Scooter A", "Available", map_locations[0]],
        [101, "Scooter B", "Available", map_locations[0]],
        [102, "Scooter C", "Available", map_locations[0]],
        [103, "Scooter D", "Available", map_locations[0]],
        [104, "Scooter E", "Available", map_locations[0]],
        [105, "Scooter F", "Available", map_locations[0]],
        [106, "Scooter G", "Available", map_locations[0]],
        [107, "Scooter H", "Available", map_locations[0]],
        [108, "Scooter I", "Available", map_locations[0]],
        [109, "Scooter J", "Available", map_locations[0]],
        [200, "Scooter K", "Available", map_locations[0]],
        [201, "Scooter L", "Available", map_locations[0]],
        [202, "Scooter M", "Available", map_locations[0]],
        [203, "Scooter N", "Available", map_locations[0]],
        [204, "Scooter O", "Available", map_locations[0]],
        [205, "Scooter P", "Available", map_locations[0]],
        [206, "Scooter Q", "Available", map_locations[0]],
        [207, "Scooter R", "Available", map_locations[0]],
        [208, "Scooter S", "Available", map_locations[0]],
        [209, "Scooter T", "Available", map_locations[0]]]
    const times = ["1 hour", "4 hours", "1 day", "1 week"]
    const currentPrice = 10
    return (
        <>
            <h1>Scooter Management</h1>
            <h3>Configure scooter availability</h3>
            <div class="scroll-scooter">
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Scooter ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Location</th>
                    </tr>
                    </thead>
                    <tbody>
                    {scooters.map((scooter, idx) => (
                        <tr>
                            <td key={idx}>
                                {scooter[0]}
                                <input name="scooter-id" placeholder="Change scooter id" required/>
                            </td>
                            <td key={idx}>
                                {scooter[1]}
                                <input name="scooter-name" placeholder="Change scooter name" required/>
                            </td>
                            <td key={idx}>
                                {scooter[2]}
                                <Button>Make unavailable</Button>
                            </td>
                            <td key={idx}>
                                {scooter[3][2]} - {scooter[3][0]}
                                <DropdownButton id="dropdown-basic-button" title="Change scooter location">
                                    {map_locations.map((location, idx) => (
                                        <Dropdown.Item key={idx}>{location[2]} - {location[0]}</Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>
            <Button>Save Changes</Button>
            <h3>Configure scooter price</h3>
            <h4>Price per time slot</h4>
            <DropdownButton id="dropdown-basic-button" title="Select hire period">
                {times.map((time, idx) => (
                    <Dropdown.Item key={idx}>{time}</Dropdown.Item>
                ))}
            </DropdownButton>
            <h5>Current price: £{currentPrice}</h5>
            <h5>Change scooter price</h5>
            <InputGroup className="mb-3">
                <InputGroup.Text>£</InputGroup.Text>
                <input type="price" name="price" required/>
            </InputGroup>
            <Button bg="dark">Update price</Button>
        </>
    );
}

export default ScooterManagement;