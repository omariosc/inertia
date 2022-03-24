import React, {useState} from "react";
import {InputGroup, Button, Modal} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css"
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function LoginForm(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const userDetails = [];

    async function onSubmit() {
        try {
            const request = await fetch('https://localhost:7220/api/Users/authorize', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    'email': email,
                    'password': password
                })
            });
            const response = await request.json();
            try {
                userDetails.push(response.accountId);
                userDetails.push(response.name);
                userDetails.push(response.email);
                userDetails.push(response.role);
                userDetails.push(response.state);
                userDetails.push(response.userType);
                userDetails.push(response.accessToken);
                if (email == "admin@inertia" && password == "admin") {
                    cookies.set("accessToken", userDetails[6], {path: '/'});
                    props.onManager();
                } else if (userDetails[3] == 2){
                    cookies.set("accessToken", userDetails[6], {path: '/'});
                    props.onEmployee();
                } else {
                    cookies.set("accessToken", userDetails[6], {path: '/'});
                    props.onCustomer();
                }
                console.log(response);
            } catch (error) {
                console.log("Error: Invalid user credentials")
            }
        } catch (error) {
            console.error(error);
        }
        // if (email == "admin@inertia" && password == "admin") {
        //     props.onManager();
        // } else if (email.startsWith("em")) {
        //     props.onEmployee();
        // } else {
        //     props.onCustomer();
        // }
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