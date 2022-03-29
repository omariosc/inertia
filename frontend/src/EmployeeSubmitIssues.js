import React, {useState} from "react";
import {Button, Col, Container, Form, FormSelect, Row} from "react-bootstrap";
import Cookies from "universal-cookie";
import './StaffInterface.css';

export default function SubmitIssues() {
    const cookies = new Cookies();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('');

    async function submitIssue() {
        console.log(title);
        console.log(content);
        console.log(priority);
    }

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
                                <Form.Label><b>Enter Issue Title</b></Form.Label>
                                <Form.Control placeholder="Enter issue title here..."
                                              onInput={e => setTitle(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label><b>Enter Issue Description</b></Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Enter issue description here..."
                                              onInput={e => setContent(e.target.value)}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label><b>Select Priority</b></Form.Label>
                                <FormSelect
                                    onChange={(e) => {
                                        setPriority(e.target.value)
                                    }}
                                >
                                    <option value="none">Select priority...
                                    </option>
                                    {["None", "Low", "Medium", "High"].map((priority, idx) => (
                                        <option value={idx}>{priority}</option>
                                    ))}
                                </FormSelect>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Button onClick={submitIssue}>Submit Issue</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}