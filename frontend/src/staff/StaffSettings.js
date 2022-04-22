import React, {useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import changePassword from "../ChangePassword";

export default function StaffSettings() {
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function onSubmit() {
        await changePassword(oldPassword, password, confirmPassword);
    }

    return (
        <>
            <h1 id={"pageName"}>Settings</h1>
            <br/>
            <Container>
                <Row>
                    <Col xs={4}/>
                    <Col xs={4}>
                        <h3>Change Password</h3>
                        <br/>
                        <Form>
                            <Form.Group>
                                <Form.Label><b>Old Password</b></Form.Label>
                                <Form.Control type="password" onInput={e => setOldPassword(e.target.value)}
                                              placeholder="Enter old password"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>New Password</b></Form.Label>
                                <Form.Control type="password" onInput={e => setPassword(e.target.value)}
                                              placeholder="Enter new password"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Confirm Password</b></Form.Label>
                                <Form.Control type="password" onInput={e => setConfirmPassword(e.target.value)}
                                              placeholder="Confirm new password"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Button style={{float: 'right'}} onClick={onSubmit}>Change password</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};