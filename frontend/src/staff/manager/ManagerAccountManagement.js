import React, {useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import { useAccount } from '../../authorize';
import validate from '../../Validators';
import host from '../../host';

export default function ManagerAccountManagement() {
    const [account] = useAccount();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function onSubmit() {
        if (!validate(name, email, password, confirmPassword)) {
            return;
        }
        try {
            let signupRequest = await fetch(host + 'api/Users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                body: JSON.stringify({
                    'name': name,
                    'email': email,
                    'password': password
                }),
                mode: "cors"
            });
            let signupResponse = await signupRequest;
            if (signupResponse.status === 422) {
                NotificationManager.error("Email address already exists.", "Error");
                return;
            }
            let getRequest = await fetch(host + 'api/admin/Users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                mode: "cors"
            });
            let getResponse = await getRequest.json();
            let accountId;
            for (let i = 0; getResponse.length; i++) {
                let account = getResponse[i];
                if (account.email === email) {
                    accountId = account.accountId;
                    break;
                }
            }
            if (!accountId) {
                NotificationManager.error("Could not patch account to employee role.", "Error");
                return;
            }
            let patchRequest = await fetch(host + `api/admin/Users/${accountId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                body: JSON.stringify({
                    'accountRole': 1
                }),
                mode: "cors"
            });
            let patchResponse = await patchRequest;
            if (patchResponse.status === 200) {
                NotificationManager.success(`Created employee account for ${name}.`, "Success");
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
            } else {
                NotificationManager.error(patchResponse.description, "Error");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home </a> > <b>
                <a className="breadcrumb-current" href="/account-management">Account Management</a></b>
            </p>
            <h3 id="pageName">Create Employee Account</h3>
            <hr id="underline"/>
            <Container>
                <Form className="input-form">
                    <Form.Group className="mb-3">
                        <Form.Label><h5>Employee Name</h5></Form.Label>
                        <Form.Control autoFocus type="name" value={name} onInput={e => setName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label><h5>Employee Email</h5></Form.Label>
                        <Form.Control type="email" value={email} onInput={e => setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label><h5>Employee Password</h5></Form.Label>
                        <Form.Control type="password" value={password} onInput={e => setPassword(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label><h5>Confirm Employee Password</h5></Form.Label>
                        <Form.Control type="password" value={confirmPassword} onInput={e => setConfirmPassword(e.target.value)}/>
                    </Form.Group>
                    <Button className="float-right" onClick={onSubmit}>Create Employee Account</Button>
                </Form>
            </Container>
        </>
    );
};