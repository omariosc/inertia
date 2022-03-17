import React from "react";
import {Button, Card} from "react-bootstrap";
import './Manager.css'

function Issues() {
    const issues = [
        ["It appears the scooter 103 has faulty brakes and will need to be made unavailable until is able to be serviced.", "sc20jdr"],
        ["Scooter 108 is not available to be rented despite being in working order.", "sc20wt"],
        ["The payment system does not accept my credit card details.", "sc20osc"],
        ["The price of scooter 202 has been set to half of what it should be.", "sc20mf"]]
    return (
        <>
            <h1>Issues</h1>
            <div class="scroll">
                {issues.map((issue, idx) => (
                    <Card
                        bg="dark"
                        key={idx}
                        text="white"
                        className="mb-2"
                    >
                        <Card.Header>Issue {idx + 1}</Card.Header>
                        <Card.Body>
                            <Card.Text>{issue[0]}</Card.Text>
                            <Card.Text>Reported by: {issue[1]}</Card.Text>
                            <Button>Mark as Resolved</Button>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </>
    );
}

export default Issues;