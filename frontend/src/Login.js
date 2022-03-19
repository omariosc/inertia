import React from "react";
import {InputGroup, Button, Modal} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css"

function LoginForm(props) {
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
                    <input type="text" name="email" placeholder="Enter email address" required/>
                </InputGroup>
                <br/>
                <InputGroup>
                    <input type="password" name="password" placeholder="Enter password" required/>
                </InputGroup>
                <br/>
                <InputGroup>
                    <input type="checkbox" name="remember"/>Remember me
                </InputGroup>
                <br/>
                <a href="#/forgot-password">Forgot Password?</a>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={props.onHide}>
                    Login
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default LoginForm;