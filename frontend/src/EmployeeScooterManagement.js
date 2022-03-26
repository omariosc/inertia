import React from "react";
import {Button, Container, Table} from "react-bootstrap";
import './StaffInterface.css';

export default function ScooterManagement() {
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
    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Scooter Management</h1>
            <br/>
            <Container>
                <h3>Configure scooter availability</h3>
                <br/>
                <div className="scroll">
                    <Table striped bordered hover style={{tableLayout: 'fixed'}}>
                        <thead>
                        <tr>
                            <th>Scooter ID</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Action</th>
                            <th>Location</th>
                        </tr>
                        </thead>
                        <tbody>
                        {scooters.map((scooter, idx) => (
                            <tr>
                                <td key={idx}>{scooter[0]}</td>
                                <td key={idx}>{scooter[1]}</td>
                                <td key={idx}>{scooter[2]}</td>
                                <td key={idx}><Button>Make unavailable</Button></td>
                                <td key={idx}>{scooter[3][2]} - {scooter[3][0]}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </>
    );
}