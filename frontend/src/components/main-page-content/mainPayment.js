import {Button, Container, Col, Form, Row} from "react-bootstrap";
import Cards from "elt-react-credit-cards";
import React, {useEffect, useState} from "react";
import {NotificationManager} from "react-notifications";
import host from "../../host";
import {useNavigate, useParams} from "react-router-dom";
import moment from "moment";
import {useAccount} from "../../authorize";

export default function MainPayment() {
    const {scooterChoiceId, hireChoiceId, startTime} = useParams();
    const [account] = useAccount();
    const navigate = useNavigate();
    const [price, setPrice] = useState('');
    const [cardNo, setCardNo] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCVV] = useState('');
    const [focus, setFocus] = useState('');
    const [validCardNo, setValidCardNo] = useState(true);
    const [validExpDate, setValidExpDate] = useState(true);
    const [validCVV, setValidCVV] = useState(true);
    const [discount, setDiscount] = useState(false);
    const [discountType, setDiscountType] = useState('');
    const [loading, setLoading] = useState('');
    const [saveCard, setSaveCard] = useState(false);
    const [savedCardDetails, setSavedCardDetails] = useState(null);

    useEffect(() => {
        fetchDiscountStatus();
        checkCardExists();
    }, []);


    /**
     * Checks if the customer is currently eligible for frequent user discount,
     * applies it and updates backend server if they are
     */
    async function getDiscountStatus() {
        try {
            let request = await fetch(host + `api/Users/${account.id}/orders`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                mode: "cors"
            });
            let response = await request.json();
            let thresholdDate = moment().subtract(1, 'week').toISOString();
            let recentBookings = response.filter(e => e.createdAt >= thresholdDate);
            let recentHours = 0;
            for (let i = 0; i < recentBookings.length; i++) {
                if (recentBookings[i].orderState !== 0 && recentBookings[i].orderState !== 6) {
                    recentHours += recentBookings[i].hireOption.durationInHours;
                    if (recentBookings[i]["extensions"] != null) {
                        for (let j = 0; j < recentBookings[i]["extensions"].length; j++) {
                            recentHours += recentBookings[i]["extensions"][j].hireOption.durationInHours;
                        }
                    }
                }
            }
            if (recentHours >= 8) {
                setDiscount(true);
                setDiscountType("Frequent User");
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Checks if the user is eligible for another type of discount, e.g. student discount
     * and applies the discount
     */
    async function fetchDiscountStatus() {
        try {
            let request = await fetch(host + `api/Users/${account.id}/profile`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                mode: "cors"
            });
            let response = await request.json();
            if (response.userType === 0) {
                setDiscount(true);
                setDiscountType("Student");
            } else if (response.userType === 1) {
                setDiscount(true);
                setDiscountType("Senior");
            } else {
                await getDiscountStatus();
            }
            setLoading('complete');
        } catch (e) {
            console.log(e);
        }
    }


    /**
     * Checks card number of the new booking is valid
     */
    function validateCardNo(stateChange) {
        if (savedCardDetails !== null) {
            return true;
        }
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
        if (savedCardDetails !== null) {
            return true;
        }
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
        if (savedCardDetails !== null) {
            return true;
        }
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
            let request = await fetch(host + "api/Orders", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                body: JSON.stringify({
                    'hireOptionId': parseInt(hireChoiceId),
                    'scooterId': parseInt(scooterChoiceId),
                    'startTime': startTime
                }),
                mode: "cors"
            });
            let response = await request;
            console.log({
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                body: JSON.stringify({
                    'hireOptionId': parseInt(hireChoiceId),
                    'scooterId': parseInt(scooterChoiceId),
                    'startTime': startTime
                }),
                mode: "cors"
            });
            if (response.status === 422) {
                NotificationManager.error("Scooter is currently unavailable.", "Error");
            } else if (response.status === 400) {
                NotificationManager.error("Please fill in all required fields.", "Error");
            } else if (response.status === 200) {
                NotificationManager.success("Created Booking.", "Success");
                if (savedCardDetails === null && saveCard) {
                    const card = {
                        cardNumber: cardNo,
                        expiryDate: expiry,
                        cvv: cvv
                    };
                    localStorage.setItem(account.id, JSON.stringify(card));
                    NotificationManager.success("Stored credit card details.", "Success");
                }
                navigate('/current-bookings');
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Check if a card is stored in local cookies
     */
    function checkCardExists() {
        if (localStorage.getItem(account.id)) {
            setSavedCardDetails(JSON.parse(localStorage.getItem(account.id)));
        }
        return (!!localStorage.getItem(account.id));
    }


    return (
        <div className={"content"}>
            <Container>
                <br/>
                <br/>
                <div>
                    {savedCardDetails === null ?
                        <>
                            <h5>Payment details</h5>
                            <Row className="pb-2 small-padding-top">
                                <Col className="text-end col-9 align-self-center">
                                    Save Card Details:
                                </Col>
                                <Col>
                                    <Form.Switch onClick={(e) =>
                                        setSaveCard(e.target.checked)}/>
                                </Col>
                            </Row>
                            <Row className="pb-2 small-padding-top">
                                <Cards
                                    cvc={cvv}
                                    expiry={expiry}
                                    focused={focus}
                                    name={account.name}
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
                        </>
                        : <>
                            <h5>Using stored payment details</h5>
                            <Row className="pb-2">
                                <Col className="text-end col-3 align-self-center">
                                    Card Number:
                                </Col>
                                <Col>
                                    **** ****
                                    **** {savedCardDetails.cardNumber.slice(savedCardDetails.cardNumber.length - 4)}
                                </Col>
                            </Row>
                            <Row className="pb-2">
                                <Col className="text-end col-3 align-self-center">
                                    Expiry Date:
                                </Col>
                                <Col>
                                    {savedCardDetails.expiryDate}
                                </Col>
                            </Row>
                            <Row>
                                <Col className="offset-3">
                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            localStorage.removeItem(account.id);
                                            NotificationManager.success("Deleted credit card details.", "Success");
                                            setSavedCardDetails(null);
                                        }}>
                                        Delete Card Details
                                    </Button>
                                </Col>
                            </Row>
                        </>
                    }
                </div>
                <div className="text-center">
                    <Button onClick={createBooking}>Confirm Booking</Button>
                </div>

            </Container>
        </div>
    );
};