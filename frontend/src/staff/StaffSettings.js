import React, {useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import { useAccount } from '../authorize';
import changePassword from "../ChangePassword";
import {useNavigate} from "react-router-dom";

export default function StaffSettings() {
    const [account] = useAccount();
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    async function onSubmit() {
        if(await changePassword(oldPassword, password, confirmPassword)){
            setOldPassword("");
            setPassword("");
            setConfirmPassword("");
            navigate("../dashboard")
        }

    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list"
                   href={(account.role === "2") ? "/dashboard" : "/home"}>Home</a> > <b>
                <a className="breadcrumb-current" href="/settings">Settings</a></b>
            </p>
            <h3 id="pageName">Change Password</h3>
            <hr id="underline"/>
            <Container>
                <Form className="input-form">
                    <Form.Group className="mb-3">
                        <Form.Label><h5>Old Password</h5></Form.Label>
                        <Form.Control autoFocus placeholder="Enter old password..." value={oldPassword} type="password"
                                      onInput={e => setOldPassword(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label><h5>New Password</h5></Form.Label>
                        <Form.Control type="password" placeholder="Enter new password..." value={password}
                                      onInput={e => setPassword(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label><h5>Confirm Password</h5></Form.Label>
                        <Form.Control type="password" placeholder="Confirm new password..." value={confirmPassword}
                                      onInput={e => setConfirmPassword(e.target.value)}/>
                    </Form.Group>
                    <Button className="float-right" onClick={onSubmit}>Change password</Button>
                </Form>
            </Container>
        </>
    );
};