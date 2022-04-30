import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import {Button, Form, Modal} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import {signIn, useAccount} from "./authorize";

export default function LoginForm(props) {
    let navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [account, signOut, signIn] = useAccount();

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
                <Button className="float-right" onClick={() => {
                    signIn(email, password);
                    navigate('/');
                }}>Login</Button>
            </Modal.Footer>
        </Modal>
    );
};