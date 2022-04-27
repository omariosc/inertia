import React, {useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import Cookies from "universal-cookie";
import changePassword from "../ChangePassword";

export default function StaffSettings() {
    const cookies = new Cookies();
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function onSubmit() {
        await changePassword(oldPassword, password, confirmPassword);
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href={(cookies.get("accountRole") === "2") ? "/dashboard" : "/home"}>Home</a> > <b>
                <a className="breadcrumb-current" href="/settings">Settings</a></b>
            </p>
            <h3 id="pageName">Change Password</h3>
            <hr id="underline"/>
            <Container>
                <Form>
                    <div className="input">
                        <label>Old Password</label>
                        <input autoFocus type="password" onInput={e => setOldPassword(e.target.value)}/>
                    </div>
                    <div className="input">
                        <label>New Password</label>
                        <input type="password" onInput={e => setPassword(e.target.value)}/>
                    </div>
                    <div className="input">
                        <label>Confirm Password</label>
                        <input type="password" onInput={e => setConfirmPassword(e.target.value)}/>
                    </div>
                    <Form.Group className="large-padding-top">
                        <Button onClick={onSubmit}>Change password</Button>
                    </Form.Group>
                </Form>
            </Container>
        </>
    );
};