import React from "react";
import {Button, Form} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SubmitIssue() {
    return (
        <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label><h5>Description of Issue</h5></Form.Label>
                <Form.Control as="textarea" rows={3}/>
            </Form.Group>
            <Form.Group>
                <Button style={{float: "right"}}>Submit Issue</Button>
            </Form.Group>
        </Form>
    );
}