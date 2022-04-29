import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import {Button, Form, Modal} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import Cookies from 'universal-cookie';
import host from './host';

export default function LoginForm(props) {
    let navigate = useNavigate();
    const cookies = new Cookies();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Attempts to authorize user.
    async function onSubmit() {
        try {
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

                navigate('/');
                window.location.reload(true);
            } else {
                NotificationManager.error("Login credentials invalid.", "Error");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Modal {...props} centered>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Control className="max-width" type="email" placeholder="Enter email address"
                              onInput={e => setEmail(e.target.value)}/>
                <br/>
                <Form.Control className="max-width" type="password" placeholder="Enter password"
                              onInput={e => setPassword(e.target.value)}/>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button className="float-left" variant="danger" onClick={props.onHide}>Cancel</Button>
                <Button className="float-right" onClick={onSubmit}>Login</Button>
            </Modal.Footer>
        </Modal>
    );
};