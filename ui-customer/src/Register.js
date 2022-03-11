import React from "react";
import {InputGroup, Button, Modal} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css"
import './Forms.css';

function RegisterForm(props) {
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
                    <input type="text" name="name" placeholder="name" required/>
                </InputGroup>
                <br/>
                <InputGroup>
                    <input type="text" name="email" placeholder="email" required/>
                </InputGroup>
                <br/>
                <InputGroup>
                    <input type="password" name="password" placeholder="password" required/>
                </InputGroup>
                <br/>
                <InputGroup>
                    <input type="password" name="confirm_password" placeholder="confirm password" required/>
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={props.onHide}>
                    Register
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default RegisterForm;