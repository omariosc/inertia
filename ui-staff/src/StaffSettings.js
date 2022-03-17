import React from "react";
import {Button, InputGroup} from "react-bootstrap";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

function Settings() {
    return (
        <>
            <h1>Settings</h1>
            <h3>Change Password</h3>
            <h4>Old Password</h4>
            <InputGroup className="mb-3">
                <input type="password" required/>
            </InputGroup>
            <h4>New Password</h4>
            <InputGroup className="mb-3">
                <input type="password" required/>
            </InputGroup>
            <h4>Confirm Password</h4>
            <InputGroup className="mb-3">
                <input type="password" required/>
            </InputGroup>
            <Button bg="dark">Change password</Button>
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