/*
	Purpose of file: Allow a staff member to extend a booking
	for an unregistered user
*/

import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import Cookies from "universal-cookie";
import host from "../../host";

/**
 * Returns the employee extend booking page, allows a staff member
 * to prolong a booking for an unregistered user
 */
export default function EmployeeExtendGuestBooking() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const {orderId} = useParams();
    const [baseOrder, setBaseOrder] = useState("");
    const [hireOptions, setHireOptions] = useState('');
    const [hireChoiceId, setHireChoiceId] = useState('');
    const [cardNo, setCardNo] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCVV] = useState('');
    const [validHireSlot, setValidHireSlot] = useState(true);
    const [validCardNo, setValidCardNo] = useState(true);
    const [validExpDate, setValidExpDate] = useState(true);
    const [validCVV, setValidCVV] = useState(true);

    useEffect(() => {
        fetchOrderInfo();
        fetchHirePeriods();
    }, []);


		/**
		 * Gets detailed information of a specific order from the backend server
		 */
    async function fetchOrderInfo() {
        try {
            let request = await fetch(host + `api/admin/Orders/${orderId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let response = await request;
            if (response.status === 200) {
                setBaseOrder(await response.json());
            } else {
                navigate("/current-bookings")
                NotificationManager.error("Order does not exist", "Error");
            }

        } catch (error) {
            console.error(error);
        }
    }

		/**
		 * Gets list of hire periods from the backend server
		 */
    async function fetchHirePeriods() {
        try {
            let request = await fetch(host + "api/HireOptions", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            setHireOptions((await request.json()).sort((a, b) => a.cost - b.cost));
        } catch (error) {
            console.error(error);
        }
    }

		/**
		 * Checks that a chosen hire slot is valid
		 */
    function validateHireSlot(stateChange) {
        let valid = hireChoiceId !== '' && hireChoiceId !== 'none';
        if (stateChange) {
            setValidHireSlot(valid);
        }
        return valid;
    }

		/**
		 * Checks that the provided card number is valid
		 */
    function validateCardNo(stateChange) {
        let valid = cardNo.length > 9 && cardNo.length < 20;
        if (stateChange) {
            setValidCardNo(valid);
        }
        return valid;
    }

		/**
		 * Checks that the provided expiry date of the card is valid
		 */
    function validateExpDate(stateChange) {
        let valid = expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/);
        if (stateChange) {
            setValidExpDate(valid);
        }
        return valid;
    }

		/**
		 * Checks that the provided CVV of the card is valid
		 */
    function validateCVV(stateChange) {
        let valid = cvv.match(/^[0-9]{3,4}$/);
        if (stateChange) {
            setValidCVV(valid);
        }
        return valid;
    }


		/**
		 * If validations are passed and extension is valid, updates the backend server
		 * and extends the booking
		 */
    async function extendBooking() {
        let valid = true
        let validateFuncs = [validateHireSlot, validateCardNo, validateCVV, validateExpDate]
        validateFuncs.forEach((validateTerm) => {
            if (valid) {
                valid = validateTerm(true);
            } else {
                validateTerm(true);
            }

        })
        if (!valid) {
            NotificationManager.error("Invalid Details Provided", "Error");
        } else {
            try {
                let request = await fetch(host + `api/admin/Orders/${orderId}/extend`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${cookies.get('accessToken')}`
                    },
                    body: JSON.stringify({
                        'hireOptionId': parseInt(hireChoiceId)
                    }),
                    mode: "cors"
                });
                let response = await request;
                if (response.status !== 200) {
                    NotificationManager.error("Could not extend booking.", "Error");
                } else {
                    NotificationManager.success("Extended booking.", "Success");
                    navigate("/bookings")
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/home">Home
                </a> > <a className="breadcrumb-list" href="/bookings">Bookings</a> > <b>
                <a className="breadcrumb-current" href="/create-guest-booking">Create Booking</a></b>
            </p>
            <h3 id="pageName">Create Booking</h3>
            <hr id="underline"/>

            <Container className="autoScrollSub">
                <h5>Customer Details</h5>
                <Row className="pb-2 small-padding-top">
                    <Col className="text-end col-6 align-self-center">
                        Name:
                    </Col>
                    <Col>
                        {(!baseOrder) ?
                            <> Loading name... </> :
                            <Form.Control value={baseOrder.account.name} disabled />
                        }
                    </Col>
                </Row>
                <Row className="pb-2">
                    <Col className="text-end align-self-center">
                        Email Address:
                    </Col>
                    <Col>
                        {(!baseOrder) ?
                            <> Loading email... </> :
                            <Form.Control value={baseOrder.account.email} disabled />
                        }
                    </Col>
                </Row>
                <h5>Booking Details</h5>
                <Row className="pb-2">
                    <Col className="text-end col-6 align-self-center">
                        Depot:
                    </Col>
                    <Col>
                        {(!baseOrder) ?
                            <> Loading depot... </> :
                            <Form.Control value={baseOrder.scooter.depo.name} disabled />
                        }
                    </Col>
                </Row>
                <Row className="pb-2">
                    <Col className="text-end col-6 align-self-center">
                        Start Date:
                    </Col>
                    <Col>
                        {(!baseOrder) ?
                            <> Loading booking... </> :
                            <Form.Control value={baseOrder.startTime} disabled />
                        }

                    </Col>
                </Row>
                <Row className="pb-2">
                    <Col className="text-end col-6 align-self-center">
                        Hire Period:
                    </Col>
                    <Col>
                        {(hireOptions === "") ? <>Loading hire periods...</> : <>
                            <Form.Select isInvalid={!validHireSlot} defaultValue="none" onChange={(e) => {
                                let value = e.target.value.split(',')
                                setHireChoiceId(value[0]);
                            }}>

                                <option value="none" key="none" disabled hidden>Select Hire Period</option>
                                {hireOptions.map((option, idx) => (
                                    <option key={idx} value={[option.hireOptionId, option.cost]}>{option.name} -
                                        £{option.cost}</option>
                                ))}
                            </Form.Select>
                        </>
                        }
                    </Col>
                </Row>
                <h5>Payment details</h5>
                <Row className="pb-2 small-padding-top">
                    <Col className="text-end col-6 align-self-center">
                        Card Number:
                    </Col>
                    <Col className="text-end">
                        <Form.Control type="text" placeholder="4000-1234-5678-9010"
                                      isInvalid={!validCardNo}
                                      onInput={e => setCardNo(e.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            Invalid Card Number
                        </Form.Control.Feedback>
                    </Col>
                </Row>
                <Row className="pb-2">
                    <Col className="text-end col-6 align-self-center">
                        Expiry Date:
                    </Col>
                    <Col className="text-end">
                        <Form.Control type="text" placeholder="MM/YY"
                                      isInvalid={!validExpDate}
                                      onInput={e => setExpiry(e.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            Invalid Expiry Date
                        </Form.Control.Feedback>
                    </Col>
                </Row>
                <Row className="pb-2">
                    <Col className="text-end col-6 align-self-center">
                        CVV:
                    </Col>
                    <Col className="text-end">
                        <Form.Control type="text" placeholder="123"
                                      isInvalid={!validCVV}
                                      onInput={e => setCVV(e.target.value)}/>
                        <Form.Control.Feedback type="invalid">
                            Invalid CVV
                        </Form.Control.Feedback>

                    </Col>
                </Row>
                <Button onClick={extendBooking}>Extend Booking</Button>
            </Container>

        </>
    );
};