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
            {(accountInfo === '') ?
                <h6>Loading account information...</h6> :
                <Table>
                    <tbody>
                    <tr>
                        <td><b>Name: </b></td>
                        <td>{accountInfo.name}</td>
                    </tr>
                    <tr>
                        <td><b>Email: </b></td>
                        <td>{accountInfo.email}</td>
                    </tr>
                    </tbody>
                </Table>
            }
            <h5 style={{paddingTop: "5px"}}>Change Password</h5>
            <Form>
                <Form.Group>
                    <Form.Label><b>Old Password</b></Form.Label>
                    <Form.Control type="password" onInput={e => setOldPassword(e.target.value)}
                                  placeholder="Enter old password"/>
                </Form.Group>
                <Form.Group>
                    <Form.Label><b>New Password</b></Form.Label>
                    <Form.Control type="password" onInput={e => setPassword(e.target.value)}
                                  placeholder="Enter new password"/>
                </Form.Group>
                <Form.Group>
                    <Form.Label><b>Confirm Password</b></Form.Label>
                    <Form.Control type="password" onInput={e => setConfirmPassword(e.target.value)}
                                  placeholder="Confirm new password"/>
                </Form.Group>
                <Form.Group>
                    <Button style={{float: 'right'}} onClick={onSubmit}>Change password</Button>
                </Form.Group>
            </Form>
        </>
    );
};