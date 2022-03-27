import React, {useState} from "react";
import {InputGroup, Button, Modal} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import host from './host';
import Cookies from 'universal-cookie';

export default function LoginForm(props) {
    const cookies = new Cookies();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
            if (response.account) {
                console.log(response)
                alert(`Logged in as ${response.account.name}.`);
                cookies.set("accountID", response.account.accountId, {path: '/'});
                cookies.set("accessToken", response.accessToken, {path: '/'});
                if (email === "admin@inertia" || response.account.role === 2) {
                    props.showmanager();
                } else if (response.account.role === 1) {
                    props.showemployee();
                } else if (response.account.role === 0) {
                    props.showcustomer();
                } else {
                    console.log(response);
                }
            } else {
                alert(response.description);
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