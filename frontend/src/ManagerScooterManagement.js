import React from "react";
import {DropdownButton, Dropdown, Button, Col, Container, Row, InputGroup, Table, Form} from "react-bootstrap";
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
    const price = [10, 30, 100, 1000]
    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Scooter Management</h1>
            <br/>
            <Container>
                <Row>
                    <Col xs={8}>
                        <h3>Configure scooter availability</h3>
                        <br/>
                        <div className="scroll-scooters">
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
                                            <input id={idx + "-id"} name="scooter-id" placeholder="Change scooter id"
                                                   required/>
                                        </td>
                                        <td key={idx}>
                                            {scooter[1]}
                                            <input id={idx + "-name"} name="scooter-name"
                                                   placeholder="Change scooter name"
                                                   required/>
                                        </td>
                                        <td key={idx}>
                                            {scooter[2]}
                                            <Button variant="primary">Make unavailable</Button>
                                        </td>
                                        <td key={idx}>
                                            {scooter[3][2]} - {scooter[3][0]}
                                            <DropdownButton id="dropdown-basic-button" title="Change scooter location"
                                                            variant="primary">
                                                {map_locations.map((location, idx) => (
                                                    <Dropdown.Item
                                                        key={idx}>{location[2]} - {location[0]}</Dropdown.Item>
                                                ))}
                                            </DropdownButton>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </div>
                        <br/>
                        <br/>
                        <Button variant="primary" style={{float: "right"}}>Save changes</Button>
                    </Col>
                    <Col xs={1}/>
                    <Col xs={3} md={3}>
                        <h3>Configure scooter price</h3>
                        <br/>
                        <Form>
                            <Form.Group>
                                <Form.Label><b>Price per time slot</b></Form.Label>
                                <Form.Select id="dropdown-basic-button" title="Select hire period">
                                    {times.map((time, idx) => (
                                        <option key={idx}>{time} - £{price[idx]}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <br/>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Change scooter price</b></Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>£</InputGroup.Text>
                                    <input type="price" name="price" required/>
                                </InputGroup>
                                <br/>
                            </Form.Group>
                            <Form.Group>
                                <Button variant="primary">Update price</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row></Container>
        </>
    );
}

export default ScooterManagement;