import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import {Button, InputGroup, Modal} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import {NotificationManager} from "react-notifications";
import host from './host';
import Cookies from 'universal-cookie';

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
                <InputGroup>
                    <input className="max-width" type="email" placeholder="Enter email address"
                           onInput={e => setEmail(e.target.value)}/>
                </InputGroup>
                <br/>
                <InputGroup>
                    <input className="max-width" type="password" placeholder="Enter password"
                           onInput={e => setPassword(e.target.value)}/>
                </InputGroup>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button className="float-left" variant="danger" onClick={props.onHide}>Cancel</Button>
                <Button className="float-right" onClick={onSubmit}>Login</Button>
            </Modal.Footer>
        </Modal>
    );
};