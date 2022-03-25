import React, {useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import host from "./host";
import Cookies from 'universal-cookie';

function StaffSettings({isDark, toggle}) {
    const cookies = new Cookies();
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function onSubmit() {
        if (password === confirmPassword) {
            try {
                let request = await fetch(host + `api/Users/${cookies.get('accountID')}/ChangePassword`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${cookies.get('accessToken')}`
                    },
                    body: JSON.stringify({
                        'oldPassword': oldPassword,
                        'newPassword': password
                    }),
                    mode: "cors"
                });
                let response = await request.json();
                console.log(response)
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error("Error: Passwords do not match");
        }
    }

    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Settings</h1>
            <br/>
            <Container>
                <Row>
                    <Col xs={2}/>
                    <Col xs={4}>
                        <h3>Change Password</h3>
                        <br/>
                        <Form>
                            <Form.Group>
                                <Form.Label><b>Old Password</b></Form.Label>
                                <Form.Control type="password" onInput={e => setOldPassword(e.target.value)} placeholder="Enter old password" required as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>New Password</b></Form.Label>
                                <Form.Control type="password" onInput={e => setPassword(e.target.value)} placeholder="Enter new password" required as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Confirm Password</b></Form.Label>
                                <Form.Control type="password" onInput={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" required as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Button
                                    style={{float: 'right'}}
                                    variant="primary"
                                    onClick={onSubmit}
                                >Change password</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xs={1}/>
                    <Col xs={2}>
                        <h3>Dark Mode</h3>
                        <br/>
                        <BootstrapSwitchButton
                            bg="dark"
                            checked={isDark}
                            onlabel='On'
                            offlabel='Off'
                            onstyle='light'
                            offstyle='primary'
                            onChange={toggle}
                        />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default StaffSettings;