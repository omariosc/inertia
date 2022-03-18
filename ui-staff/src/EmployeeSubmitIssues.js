import React from "react";
import {Button, Col, Container, Form, FormSelect, Row} from "react-bootstrap";
import './StaffInterface.css'

let issuePriority = "Select Priority"

function SubmitIssues() {
    const priorities = ["None", "Low", "Medium", "High"]

    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Submit Issues</h1>
            <br/>
            <Container>
                <Row>
                    <Col xs={3}/>
                    <Col xs={6}>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label><b>Description of Issue</b></Form.Label>
                    <Form.Control as="textarea" rows={3}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label><b>Select Priority</b></Form.Label>
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
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default SubmitIssues;