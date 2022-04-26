import React, {useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import validate from '../../Validators';
import host from '../../host';
import Cookies from "universal-cookie";

export default function ManagerAccountManagement() {
    const cookies = new Cookies();
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
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
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
                alert("Email address already exists.");
                return;
            }
            let getRequest = await fetch(host + 'api/admin/Users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
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
                alert("Could not patch account to employee role.");
                return;
            }
            let patchRequest = await fetch(host + `api/admin/Users/${accountId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    'accountRole': 1
                }),
                mode: "cors"
            });
            let patchResponse = await patchRequest;
            if (patchResponse.status === 200) {
                alert(`Created employee account for ${name}.`)
            } else {
                alert(patchResponse.description)
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home
                </a> > <a className="breadcrumb-list" href="/account-management">Account Management</a> > <b>
                <a className="breadcrumb-current" href="/account-management">Create Employee Account</a></b>
            </p>
            <h3 id="pageName">Create Employee Account</h3>
            <hr id="underline"/>
            <br/>
            <Container>
                <Form>
                    <div className="input account">
                        <label>Employee Name</label>
                        <input type="name" onInput={e => setName(e.target.value)}/>
                    </div>
                    <div className="input account">
                        <label>Employee Email</label>
                        <input type="email" onInput={e => setEmail(e.target.value)}/>
                    </div>
                    <div className="input account">
                        <label>Employee Password</label>
                        <input type="password" onInput={e => setPassword(e.target.value)}/>
                    </div>
                    <div className="input account">
                        <label>Confirm Employee Password</label>
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