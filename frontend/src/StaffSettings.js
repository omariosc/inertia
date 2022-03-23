import React from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

function StaffSettings() {
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
                                <Form.Control type="password" placeholder="Enter old password" required as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>New Password</b></Form.Label>
                                <Form.Control type="password" placeholder="Enter new password" required as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Confirm Password</b></Form.Label>
                                <Form.Control type="password" placeholder="Confirm new password" required as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Button
                                    style={{float: 'right'}}
                                    variant="primary"
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
                            checked={false}
                            onlabel='On'
                            offlabel='Off'
                            onstyle='light'
                            offstyle='primary'
                        />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default StaffSettings;