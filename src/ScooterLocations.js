import React from "react";
import {Card, Modal} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css"
import './ScooterLocations.css';

function ScooterLocations(props) {
    const scooterLocations = [
        ["Trinity Centre"],
        ["Train Station"],
        ["Merrion Centre"],
        ["Leeds General Infirmary Hospital"],
        ["UoL Edge Sports Centre"]
    ]
    return (
        <Modal
            {...props}
            centered
            className="scooter-locations"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Locations
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {scooterLocations.map((location, idx) => (
                    <Card
                        bg="dark"
                        key={idx}
                        text="white"
                        style={{width: '18rem'}}
                        className="mb-2"
                    >
                        <Card.Body>
                            <Card.Title>{location[0]}</Card.Title>
                            <Card.Text>
                                {location[0]}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </Modal.Body>
        </Modal>
    );
}

export default ScooterLocations;