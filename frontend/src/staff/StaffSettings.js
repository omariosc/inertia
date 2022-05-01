/*
	Purpose of file: Allow a staff account to change their password
*/

import React, {useState} from "react";
import {Button, Form} from "react-bootstrap";
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
                   onClick={() => {(account.role === "2") ? navigate("/dashboard") : navigate("/home")}}>Home</a> &gt; <b>
                <a className="breadcrumb-current" onClick={() => {navigate("/settings")}}>Settings</a></b>
            </p>
            <h3 id="pageName">Change Password</h3>
            <hr id="underline"/>
                <Form className="input-form">
                    <Form.Group className="mb-3">
                        <Form.Label><h6>Old Password</h6></Form.Label>
                        <Form.Control autoFocus placeholder="Enter old password..." value={oldPassword} type="password"
                                      onInput={e => setOldPassword(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label><h6>New Password</h6></Form.Label>
                        <Form.Control type="password" placeholder="Enter new password..." value={password}
                                      onInput={e => setPassword(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label><h6>Confirm Password</h6></Form.Label>
                        <Form.Control type="password" placeholder="Confirm new password..." value={confirmPassword}
                                      onInput={e => setConfirmPassword(e.target.value)}/>
                    </Form.Group>
                    <Button className="float-right" onClick={onSubmit}>Change password</Button>
                </Form>
        </>
    );
};