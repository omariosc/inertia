import React from "react";
import {Button, Form, FormSelect} from "react-bootstrap";
import './StaffInterface.css'

let issuePriority = "Select Priority"

function SubmitIssues() {
    const priorities = ["None", "Low", "Medium", "High"]

    return (
        <>
            <h1>Submit Issues</h1>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Description of Issue</Form.Label>
                    <Form.Control as="textarea" rows={3}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Select Priority</Form.Label>
                    <FormSelect>
                        {priorities.map((priority, idx) => (
                            <option key={idx} onChange={() => {
                                issuePriority = priority
                            }}>{priority}</option>
                        ))}
                    </FormSelect>
                </Form.Group>
                <br/>
                <Form.Group>
                    <Button>Submit Issue</Button>
                </Form.Group>
            </Form>
        </>
    );
}

export default SubmitIssues;