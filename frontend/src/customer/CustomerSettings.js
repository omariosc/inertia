import React, {useEffect, useState} from "react";
import {Button, Form, Table} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import changePassword from "../ChangePassword";
import host from "../host";
import Cookies from "universal-cookie";

export default function CustomerSettings() {
    const cookies = new Cookies();
    const [accountInfo, setAccountInfo] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        fetchAccountInformation();
    }, []);

    async function fetchAccountInformation() {
        try {
            let request = await fetch(host + `api/Users/${cookies.get('accountID')}/profile`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            setAccountInfo(await request.json());
        } catch (e) {
            console.log(e);
        }
    }

    async function onSubmit() {
        await changePassword(oldPassword, password, confirmPassword);
    }

    return (
        <>
            <h5>Account Information</h5>
            <br/>
            {(accountInfo === '') ?
                <p>Loading account information...</p> :
                <Table>
                    <tbody>
                    <tr>
                        <td>Name</td>
                        <td>{accountInfo.name}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{accountInfo.email}</td>
                    </tr>
                    </tbody>
                </Table>
            }
            <h5 className="small-padding-top">Change Password</h5>
            <br/>
            <Form>
                <div className="input">
                    <label>Old Password</label>
                    <input type="password" onInput={e => setOldPassword(e.target.value)}/>
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
        </>
    );
};