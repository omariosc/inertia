import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";

export default function LoginAndSignupFromBooking(props) {
    const {startTime, hireChoiceId, scooterChoiceId} = useParams();
    const navigate = useNavigate();
    return (
        <Modal {...props} centered>
            <Modal.Header closeButton>
                <Modal.Title>Authentication</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p> To create a booking you must either: </p>
                <ul>
                    <li>
                        Log into an existing account.
                    </li>
                    <li>
                        Create a new account.
                    </li>
                    <li>
                        Contact us on 778-330-2389
                    </li>
                </ul>
                <p>{startTime + hireChoiceId + scooterChoiceId}</p>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <></>
                <Button className="float-left" variant="primary"
                        onClick={()=>{navigate(`../login/${scooterChoiceId}/${hireChoiceId}/${startTime}`)}}>Log In</Button>
                <Button className="float-left" variant="primary"
                        onClick={()=>{navigate(`../signup/${scooterChoiceId}/${hireChoiceId}/${startTime}`)}}>Sign Up</Button>
            </Modal.Footer>
        </Modal>
    );
};
