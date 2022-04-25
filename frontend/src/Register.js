import React, {useState} from "react";
import {Button, InputGroup, Modal} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import host from './host';
import validate from './Validators';

export default function RegisterForm(props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
                props.onHide();
            } else {
                alert("Email address already in use.");
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
                <InputGroup>
                    <input className="max-width" type="text" placeholder="Enter full name" onInput={e => setName(e.target.value)}/>
                </InputGroup>
                <br/>
                <InputGroup>
                    <input className="max-width" type="email" placeholder="Enter email address" onInput={e => setEmail(e.target.value)}/>
                </InputGroup>
                <br/>
                <InputGroup>
                    <input className="max-width" type="password" placeholder="Enter password" onInput={e => setPassword(e.target.value)}/>
                </InputGroup>
                <br/>
                <InputGroup>
                    <input className="max-width" type="password" placeholder="Confirm password"
                           onInput={e => setConfirmPassword(e.target.value)}/>
                </InputGroup>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button className="float-left" variant="danger" onClick={props.onHide}>Cancel</Button>
                <Button className="float-right" onClick={onSubmit}>Register</Button>
            </Modal.Footer>
        </Modal>
    );
};