import React from "react";
import {InputGroup, Button, Modal} from "react-bootstrap";

import './Register.css';

function RegisterForm(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Register
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup>
                    <input type="text" name="username" placeholder="username" required/>
                </InputGroup>
                <br/>
                <InputGroup>
                    <input type="password" name="password" placeholder="password" required/>
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={props.onHide}>
                    Register
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default RegisterForm;