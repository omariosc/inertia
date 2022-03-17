import React from "react";
import {Button, Form} from "react-bootstrap";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

function Settings() {
    return (
        <>
            <h1>Settings</h1>
            <h3>Change Password</h3>
            <Form>
                <Form.Group>
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control type="password" required as="input"/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" required as="input"/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" required as="input"/>
                </Form.Group>
                <br/>
                <Form.Group>
                    <Button>Change password</Button>
                </Form.Group>
            </Form>
            <br/><br/>
            <h3>Dark Mode</h3>
            <BootstrapSwitchButton
                checked={false}
                onlabel='On'
                offlabel='Off'
            />
        </>
    );
}

export default Settings;