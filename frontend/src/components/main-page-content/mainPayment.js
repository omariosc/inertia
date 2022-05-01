import {Button, Container, Col, Form, Row} from "react-bootstrap";
import Cards from "elt-react-credit-cards";
import React, {useState} from "react";
import {NotificationManager} from "react-notifications";
import host from "../../host";
import {useParams} from "react-router-dom";

export default function MainPayment() {
    const params = useParams();
    const startTime = params.startTime;
    const hireChoiceId = params.hireChoiceId;
    const scooterChoiceId = params.scooterId;
    const [cardNo, setCardNo] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCVV] = useState('');
    const [focus, setFocus] = useState('');
    const [validCardNo, setValidCardNo] = useState(true);
    const [validExpDate, setValidExpDate] = useState(true);
    const [validCVV, setValidCVV] = useState(true);


    /**
     * Checks card number of the new booking is valid
     */
    function validateCardNo(stateChange) {
        let valid = cardNo.length > 9 && cardNo.length < 20;
        if (stateChange) {
            setValidCardNo(valid);
        }
        return valid;
    }

    /**
     * Checks expiry date of the card for the new booking is valid
     */
    function validateExpDate(stateChange) {
        let valid = expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/);
        if (stateChange) {
            setValidExpDate(valid);
        }
        return valid;
    }

    /**
     * Checks CVV of the card for the new booking is valid
     */
    function validateCVV(stateChange) {
        let valid = cvv.match(/^[0-9]{3,4}$/);
        if (stateChange) {
            setValidCVV(valid);
        }
        return valid;
    }


    /**
     * If all validations pass, creates a new booking with the specified
     * information and updates backend server
     */
    async function createBooking() {
        let valid = true
        let validateFuncs = [validateCardNo, validateCVV, validateExpDate]
        validateFuncs.forEach((validateTerm) => {
            if (valid) {
                valid = validateTerm(true);
            } else {
                validateTerm(true);
            }

        })
        if (!valid) {
            NotificationManager.error("Invalid Details Provided", "Error");
            return;
        }
        try {
            console.log("User cannot currently do this");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Container className={"content"}>
            <Row className="text-center">
                <h5>Payment details</h5>
            </Row>
            <Row>
                <Col>
                    Email:
                </Col>
                <Col>
                    <Form.Control type="text" placeholder="user@email.com" />
                </Col>
            </Row>
            <Row className="pb-2 small-padding-top">
                <Cards
                    cvc={cvv}
                    expiry={expiry}
                    focused={focus}
                    number={cardNo}
                />
            </Row>
            <Row className="pb-2 small-padding-top">
                <Col className="text-end col-3 align-self-center">
                    Card Number:
                </Col>
                <Col className="text-end">
                    <Form.Control type="text" name="number" placeholder="4000-1234-5678-9010"
                                  isInvalid={!validCardNo}
                                  onChange={e => setCardNo(e.target.value)}
                                  onFocus={e => setFocus(e.target.name)}/>
                    <Form.Control.Feedback type="invalid">
                        Invalid Card Number
                    </Form.Control.Feedback>
                </Col>
            </Row>
            <Row className="pb-2">
                <Col className="text-end col-3 align-self-center">
                    Expiry Date:
                </Col>
                <Col className="text-end">
                    <Form.Control type="text" name="expiry" placeholder="MM/YY"
                                  isInvalid={!validExpDate}
                                  onChange={e => setExpiry(e.target.value)}
                                  onFocus={e => setFocus(e.target.name)}/>
                    <Form.Control.Feedback type="invalid">
                        Invalid Expiry Date
                    </Form.Control.Feedback>
                </Col>
            </Row>
            <Row className="pb-2">
                <Col className="text-end col-3 align-self-center">
                    CVV:
                </Col>
                <Col className="text-end">
                    <Form.Control type="text" name="cvc" placeholder="123"
                                  isInvalid={!validCVV}
                                  onChange={e => setCVV(e.target.value)}
                                  onFocus={e => setFocus(e.target.name)}/>
                    <Form.Control.Feedback type="invalid">
                        Invalid CVV
                    </Form.Control.Feedback>
                </Col>
            </Row>
            <Row className={"text-center"}>
                <Col className={"col-8 offset-2"}>
                    <Button className="text-center" disabled={!(scooterChoiceId !== "")} onClick={() => {
                        createBooking();
                    }
                    }>Make Payment</Button>
                </Col>
            </Row>
        </Container>
    )
}