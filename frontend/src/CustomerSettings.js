import React from "react";
import {Button, Col, Form, Row, Table} from "react-bootstrap";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

function CustomerSettings({isDark, toggle}) {
    const userDetails = [
        ["Full Name", "Hashir Choudry"],
        ["Email Address", "hashirsing@gmail.com"]
    ];

    return (
        <>
            <Row>
                <Col xs={6}>
                    <h5>Two-Factor Authentication</h5>
                    <Button variant="primary">Enable 2FA</Button>
                </Col>
                <Col xs={1}/>
                <Col xs={3}>
                    <h5>Dark Mode</h5>
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
            <br/>
            <h5>Account Information</h5>
            <Table>
                <tbody>
                {userDetails.map((title, info) => (
                    <tr key={info}>
                        <td>{title[0]}</td>
                        <td>{title[1]}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
            <h5 style={{paddingTop: "5px"}}>Change Password</h5>
            <br/>
            <Form>
                <Form.Group>
                    <Form.Label><h6>Old Password</h6></Form.Label>
                    <Form.Control type="password" placeholder="Enter old password" required as="input"/>
                </Form.Group>
                <br/>
                <Form.Group>
                    <Form.Label><h6>New Password</h6></Form.Label>
                    <Form.Control type="password" placeholder="Enter new password" required as="input"/>
                </Form.Group>
                <br/>
                <Form.Group>
                    <Form.Label><h6>Confirm Password</h6></Form.Label>
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
        </>
    );
}

export default CustomerSettings;