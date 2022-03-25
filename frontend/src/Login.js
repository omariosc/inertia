import React, {useState} from "react";
import {InputGroup, Button, Modal} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import host from './host';
import Cookies from 'universal-cookie';

function LoginForm(props) {
    const cookies = new Cookies();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function onSubmit() {
        try {
            const request = await fetch(host + 'api/Users/authorize', {
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
            const response = await request.json();
            try {
                if (email === "admin@inertia" && password === "admin") {
                    cookies.set("accountID", response.account.accountId, {path: '/'});
                    cookies.set("accessToken", response.accessToken, {path: '/'});
                    props.onManager();
                } else if (response.account.role === 2) {
                    cookies.set("accountID", response.account.accountId, {path: '/'});
                    cookies.set("accessToken", response.accessToken, {path: '/'});
                    props.onEmployee();
                } else if (response.account.role === 0) {
                    cookies.set("accountID", response.account.accountId, {path: '/'});
                    cookies.set("accessToken", response.accessToken, {path: '/'});
                    props.onCustomer();
                } else {
                    console.log(response);
                }
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Modal
            {...props}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Login
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup>
                    <input type="text" name="email" placeholder="Enter email address"
                           onInput={e => setEmail(e.target.value)} required/>
                </InputGroup>
                <br/>
                <InputGroup>
                    <input type="password" name="password" placeholder="Enter password"
                           onInput={e => setPassword(e.target.value)} required/>
                </InputGroup>
                <br/>
                <u>Forgot Password?</u>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onSubmit}>
                    Login
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default LoginForm;