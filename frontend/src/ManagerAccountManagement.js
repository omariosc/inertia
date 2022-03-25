import React, {useState} from "react";
import {Button, Form, Container, Col, Row} from "react-bootstrap";
import './StaffInterface.css';
import host from './host';

function AccountManagement() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function onSubmit() {
        if (password === confirmPassword) {
            try {
                const request = await fetch(host + 'api/Users/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        'name': name,
                        'email': email,
                        'password': password
                    }),
                    mode: "cors"
                });
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error("Error: Passwords do not match");
        }
    }

    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Account Management</h1>
            <br/>
            <Container>
                <Row>
                    <Col xs={4}/>
                    <Col xs={4}>
                        <Form>
                            <Form.Group>
                                <Form.Label><b>Employee Name</b></Form.Label>
                                <Form.Control type="name" onInput={e => setName(e.target.value)}
                                              placeholder="Enter employee name" required as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Employee Email</b></Form.Label>
                                <Form.Control type="email" onInput={e => setEmail(e.target.value)}
                                              placeholder="Enter employee email" required as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Employee Password</b></Form.Label>
                                <Form.Control type="password" onInput={e => setPassword(e.target.value)}
                                              placeholder="Enter employee password" required
                                              as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Confirm Employee Password</b></Form.Label>
                                <Form.Control type="password" onInput={e => setConfirmPassword(e.target.value)}
                                              placeholder="Confirm employee password" required
                                              as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Button variant="primary" onClick={onSubmit} style={{float: 'right'}}>Create Employee
                                    Account</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default AccountManagement;