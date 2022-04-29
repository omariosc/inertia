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
                <a className="breadcrumb-list"
                   href={(cookies.get("accountRole") === "2") ? "/dashboard" : "/home"}>Home</a> > <b>
                <a className="breadcrumb-current" href="/settings">Settings</a></b>
            </p>
            <h3 id="pageName">Change Password</h3>
            <hr id="underline"/>
            <Container>
                <Form className="input-form">
                    <Form.Group className="mb-3">
                        <Form.Label><h5>Old Password</h5></Form.Label>
                        <Form.Control autoFocus placeholder="Enter old password..." type="password"
                                      onInput={e => setOldPassword(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label><h5>New Password</h5></Form.Label>
                        <Form.Control type="password" placeholder="Enter new password..."
                                      onInput={e => setPassword(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label><h5>Confirm Password</h5></Form.Label>
                        <Form.Control type="password" placeholder="Confirm new password..."
                                      onInput={e => setConfirmPassword(e.target.value)}/>
                    </Form.Group>
                    <Button className="float-right" onClick={onSubmit}>Change password</Button>
                </Form>
            </Container>
        </>
    );
};