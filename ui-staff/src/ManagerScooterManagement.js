import React from "react";
import {DropdownButton, Dropdown, Button, InputGroup} from "react-bootstrap";
import './Manager.css';

function ScooterManagement() {
    const scooters = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
        200, 201, 202, 203, 204, 205, 206, 207, 208, 209]
    const times = ["1 hour", "4 hours", "1 day", "1 week"]
    const map_locations = [
        ["Trinity Centre", [53.798351, -1.545100], "A"],
        ["Train Station", [53.796770, -1.540510], "B"],
        ["Merrion Centre", [53.801270, -1.543190], "C"],
        ["Leeds General Infirmary Hospital", [53.802509, -1.552887], "D"],
        ["UoL Edge Sports Centre", [53.804167, -1.553208], "E"],
    ]
    const current_location = map_locations[0]
    return (
        <>
            <h1>Scooter Management</h1>
            <DropdownButton id="dropdown-basic-button" title="Select scooter">
                {scooters.map((scooter, idx) => (
                    <Dropdown.Item href={"#/scooter-" + scooter} key={idx}>Scooter {scooter}</Dropdown.Item>
                ))}
            </DropdownButton>
            <h3>Scooter is currently available</h3>
            <Button>Make unavailable</Button>
            <h3>Configure scooter information</h3>
            <h4>Price per time slot</h4>
            <DropdownButton id="dropdown-basic-button" title="Select hire period">
                {times.map((time, idx) => (
                    <Dropdown.Item key={idx}>{time}</Dropdown.Item>
                ))}
            </DropdownButton>
            <h5>Change scooter price</h5>
            <InputGroup className="mb-3">
                <InputGroup.Text>£</InputGroup.Text>
                <input type="price" name="price" required/>
            </InputGroup>
            <Button bg="dark">Update price</Button>
            <h4>Change scooter name</h4>
            <InputGroup className="mb-3">
                <input name="scooter-name" required/>
            </InputGroup>
            <Button>Update name</Button>
            <h3>Scooter Location</h3>
            <h4>Current Scooter Location</h4>
            <h5>{current_location[2]} - {current_location[0]}</h5>
            <h4>Change scooter location</h4>
            <DropdownButton id="dropdown-basic-button" title="Change scooter location">
                {map_locations.map((location, idx) => (
                    <Dropdown.Item key={idx}>{location[2]} - {location[0]}</Dropdown.Item>
                ))}
            </DropdownButton>
        </>
    );
}

export default ScooterManagement;