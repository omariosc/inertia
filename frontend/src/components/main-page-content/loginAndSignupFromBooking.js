import {useNavigate, useParams} from "react-router-dom";
import React, {useState} from "react";
import {useAccount} from "../../authorize";
import {Button, Form, Modal} from "react-bootstrap";
import {NotificationManager} from "react-notifications";

export default function LoginAndSignupFromBooking(props) {
    const params = useParams();
    const startTime = params.startTime;
    const hireChoiceId = params.hireChoiceId;
    const scooterChoiceId = params.scooterId;
    const navigate = useNavigate();

    return (
        <Modal {...props} centered>
            <Modal.Header closeButton>
                <Modal.Title>Authentication</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p> To create bookings you must either create an account or contact us on 778-330-2389 </p>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button className="float-left" variant="primary"
                        onClick={()=>{navigate(`../login/${startTime}/${hireChoiceId}/${scooterChoiceId}`)}}>Log In</Button>
                <Button className="float-left" variant="primary"
                        onClick={()=>{navigate(`../signup/${startTime}/${hireChoiceId}/${scooterChoiceId}`)}}>Sign Up</Button>
            </Modal.Footer>
        </Modal>
    );
};