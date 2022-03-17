import React from "react";
import {Button, Form} from "react-bootstrap";
import './StaffInterface.css'

function AccountManagement() {
    return (
        <>
            <h1>Account Management</h1>
            <h3>Name</h3>
            <Form>
                <Form.Group>
                    <Form.Label>Employee Name</Form.Label>
                    <Form.Control type="name" placeholder="Enter employee name" required as="input"/>
                </Form.Group>
                <br/>
                <Form.Group>
                    <Form.Label>Employee Username</Form.Label>
                    <Form.Control type="username" placeholder="Enter employee username" required as="input"/>
                </Form.Group>
                <br/>
                <Form.Group>
                    <Form.Label>Employee Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter employee email" required as="input"/>
                </Form.Group>
                <br/>
                <Form.Group>
                    <Button>Create account</Button>
                </Form.Group>
            </Form>
        </>
    );
}

export default AccountManagement;