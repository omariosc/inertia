import {Button, Card, Container, Form, FormSelect} from "react-bootstrap";
import React from "react";

function ManageIssues() {
    const issues = [
        ["It appears the scooter 103 has faulty brakes and will need to be made unavailable until is able to be serviced.", "sc20jdr", "High"],
        ["Scooter 108 is not available to be rented despite being in working order.", "sc20wt", "None"],
        ["The payment system does not accept my credit card details.", "sc20osc", "Medium"],
        ["The price of scooter 202 has been set to half of what it should be.", "sc20mf", "Low"]]
    const priorities = ["None", "Low", "Medium", "High"]
    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Manage Issues</h1>
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
                            <Card.Header >Issue {idx + 1}</Card.Header>
                            <Card.Body>
                                <Card.Text>{issue[0]}</Card.Text>
                                <Card.Text>Reported by: {issue[1]}</Card.Text>
                                <Card.Text>
                                    <Form>
                                        <Form.Group>
                                            <Form.Label>Priority: {issue[2]}</Form.Label>
                                            <FormSelect placeholder={issue[2]}>
                                                {priorities.map((priority, idx) => (
                                                    <option key={idx}>{priority}</option>
                                                ))}
                                            </FormSelect>
                                        </Form.Group>
                                        <br/>
                                        <Form.Group>
                                            <Button variant="primary">Change Priority</Button>
                                        </Form.Group>
                                    </Form>
                                </Card.Text>
                                <Button variant="primary">Mark as Resolved</Button>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </Container>
        </>
    );
}

export default ManageIssues;