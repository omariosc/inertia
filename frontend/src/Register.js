import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import validate from './Validators';
import host from './host';
import {useNavigate} from "react-router-dom";
import Cookies from 'universal-cookie';

export default function RegisterForm(props) {
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    // Attempts to create customer account.
    async function onSubmit() {
        if (!validate(name, email, password, confirmPassword)) {
            return;
        }
        try {
            let request = await fetch(host + 'api/Users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    'name': name,
                    'email': email,
                    'password': password
                }),
                mode: "cors"
            });
            let response = await request;
            if (response.status === 200) {
                NotificationManager.success("Registered Account.", "Success");
                props.onHide();
                let request = await fetch(host + 'api/Users/authorize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        'email': email,
                        'password': password
                    }),
                    mode: "cors"
                });
                let response = await request.json();
                if (response.accessToken) {
                    // Sets user cookies.
                    cookies.set("accountID", response.account.accountId, {path: '/'});
                    cookies.set("accountName", response.account.name, {path: '/'});
                    cookies.set("accountRole", response.account.role, {path: '/'});
                    cookies.set("accessToken", response.accessToken, {path: '/'});
                    // If staff account navigates to dashboard.
                    if (response.account.role === 2 || response.account.role === 1) {
                        NotificationManager.success("Logged in.", "Success");
                        navigate('/dashboard');
                    } else if (response.account.role === 0) {
                        NotificationManager.success("Logged in.", "Success");
                        navigate('/create-booking');
                    } else {
                        NotificationManager.error("Could not log in.", "Error");
                        console.log(response);
                    }
                    // Refreshes page.
                    window.location = window.location
                } else {
                    NotificationManager.error("Unable to Log in.", "Error");
                }
            } else {
                NotificationManager.error("Email address already in use.", "Error");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Modal {...props} centered>
            <Modal.Header closeButton>
                <Modal.Title>Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control className="max-width" type="text" placeholder="Enter full name"
                              onInput={e => setName(e.target.value)}/>
                <br/>
                <Form.Control className="max-width" type="email" placeholder="Enter email address"
                              onInput={e => setEmail(e.target.value)}/>
                <br/>
                <Form.Control className="max-width" type="password" placeholder="Enter password"
                              onInput={e => setPassword(e.target.value)}/>
                <br/>
                <Form.Control className="max-width" type="password" placeholder="Confirm password"
                              onInput={e => setConfirmPassword(e.target.value)}/>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button className="float-left" variant="danger" onClick={props.onHide}>Cancel</Button>
                <Button className="float-right" onClick={onSubmit}>Register</Button>
            </Modal.Footer>
        </Modal>
    );
};