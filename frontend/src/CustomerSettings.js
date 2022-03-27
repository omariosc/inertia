import React, {useState} from "react";
import {Button, Col, Form, Row, Table} from "react-bootstrap";
import BootstrapSwitchButton from 'bootstrap-switch-button-react';
import changePassword from "./ChangePassword";

export default function CustomerSettings({isDark, toggle}) {
    const userDetails = [
        ["Full Name", "Hashir Choudry"],
        ["Email Address", "hashirsing@gmail.com"]
    ];
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function onSubmit() {
        await changePassword(oldPassword, password, confirmPassword);
    }

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
                    <Form.Control type="password" onInput={e => setOldPassword(e.target.value)}
                                  placeholder="Enter old password" required as="input"/>
                </Form.Group>
                <br/>
                <Form.Group>
                    <Form.Label><h6>New Password</h6></Form.Label>
                    <Form.Control type="password" onInput={e => setPassword(e.target.value)}
                                  placeholder="Enter new password" required as="input"/>
                </Form.Group>
                <br/>
                <Form.Group>
                    <Form.Label><h6>Confirm Password</h6></Form.Label>
                    <Form.Control type="password" onInput={e => setConfirmPassword(e.target.value)}
                                  placeholder="Confirm new password" required as="input"/>
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
        </>
    );
}