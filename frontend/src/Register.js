import React, {useState} from "react";
import {InputGroup, Button, Modal} from "react-bootstrap";
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
                alert("Successfully registered account.")
                props.onHide();
            } else {
                alert("Email address already in use.")
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
                    Register
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup>
                    <input type="text" name="name" placeholder="Enter full name" onInput={e => setName(e.target.value)}
                           required/>
                </InputGroup>
                <br/>
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
                <InputGroup>
                    <input type="password" name="confirm_password" placeholder="Confirm password"
                           onInput={e => setConfirmPassword(e.target.value)} required/>
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onSubmit}>
                    Register
                </Button>
            </Modal.Footer>
        </Modal>
    );
}