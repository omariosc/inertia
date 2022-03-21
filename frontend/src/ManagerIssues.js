import React from "react";
import {Button, Card, Container} from "react-bootstrap";
import './StaffInterface.css'

function Issues() {
    const issues = [
        ["It appears the scooter 103 has faulty brakes and will need to be made unavailable until is able to be serviced.", "sc20jdr"],
        ["Scooter 108 is not available to be rented despite being in working order.", "sc20wt"],
        ["The payment system does not accept my credit card details.", "sc20osc"],
        ["The price of scooter 202 has been set to half of what it should be.", "sc20mf"]]
    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>High Priority Issues</h1>
            <br/>
            <Container>
                <div className="scroll">
                    {issues.map((issue, idx) => (
                        <Card
                            bg="light"
                            key={idx}
                            text="dark"
                            className="mb-2"
                        >
                            <Card.Body>
                                <Card.Text><b>Issue {idx + 1}:</b> {issue[0]}</Card.Text>
                                <Card.Text><b>Reported by:</b> {issue[1]}</Card.Text>
                                <Card.Text><b>Priority:</b> High</Card.Text>
                                <Button variant="primary">Mark as Resolved</Button>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </Container>
        </>
    );
}

export default Issues;