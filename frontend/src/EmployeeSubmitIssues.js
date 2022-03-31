import React, {useState} from "react";
import {Button, Col, Container, Form, FormSelect, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import host from "./host";
import Cookies from "universal-cookie";
import './StaffInterface.css';

export default function SubmitIssue() {
    const cookies = new Cookies();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('');

    async function submitIssue() {
        if (title.length === 0) {
            alert("Issue must have a title");
            return;
        }
        if (content.length === 0) {
            alert("Issue must have a title");
            return;
        }
        if (priority === '' || priority === 'none') {
            alert("Issue must have a priority");
            return;
        }
        try {
            await fetch(host + `api/Users/${cookies.get("accountID")}/issues`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    "priority": parseInt(priority),
                    "title": title.toString(),
                    "content": content.toString()
                }),
                mode: "cors"
            });
            alert("Created issue.");
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Submit Issue</h1>
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
                                <Button onClick={submitIssue} style={{float: "right"}}>Create Issue</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};