import React from "react";
import {Button, Form, Container, Col, Row} from "react-bootstrap";
import './StaffInterface.css'

function AccountManagement() {
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
                                <Form.Control type="name" placeholder="Enter employee name" required as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Employee Username</b></Form.Label>
                                <Form.Control type="username" placeholder="Enter employee username" required
                                              as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Employee Email</b></Form.Label>
                                <Form.Control type="email" placeholder="Enter employee email" required as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Button variant="primary" style={{float: 'right'}}>Create Employee Account</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default AccountManagement;