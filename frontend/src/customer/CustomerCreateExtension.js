import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import Cookies from 'universal-cookie';
import host from "../host";
import moment from "moment";

export default function CustomerCreateExtension() {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const {orderId} = useParams();
    const [baseOrder, setBaseOrder] = useState("");
    const [hireOptions, setHireOptions] = useState('');
    const [hireChoiceId, setHireChoiceId] = useState('');
    const [price, setPrice] = useState('');
    const [cardNo, setCardNo] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCVV] = useState('');
    const [validHireSlot, setValidHireSlot] = useState(true);
    const [validCardNo, setValidCardNo] = useState(true);
    const [validExpDate, setValidExpDate] = useState(true);
    const [validCVV, setValidCVV] = useState(true);
    const [discount, setDiscount] = useState(false);
    const [discountType, setDiscountType] = useState('');
    const [loading, setLoading] = useState('');
    const [saveCard, setSaveCard] = useState(false);
    const [savedDetailsDeleted, setSavedDetailsDeleted] = useState(false);


    useEffect(() => {
        fetchOrderInfo();
        fetchHirePeriods();
        fetchDiscountStatus();
    }, []);

    async function fetchOrderInfo() {
        try {
            let request = await fetch(host + `api/Orders/${orderId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let response = await request;
            if(response.status === 200){
                setBaseOrder(await response.json());
            } else {
                navigate("/current-bookings")
                NotificationManager.error("Order does not exist", "Error");
            }

        } catch (error) {
            console.error(error);
        }
    }


    async function getDiscountStatus() {
        try {
            let request = await fetch(host + `api/Users/${cookies.get('accountID')}/orders`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let response = await request.json();
            let thresholdDate = moment().subtract(1, 'week').toISOString()
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

    async function fetchDiscountStatus() {
        try {
            let request = await fetch(host + `api/Users/${cookies.get('accountID')}/profile`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
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


    async function extendBooking() {
        setValidHireSlot(hireChoiceId !== '' && hireChoiceId !== 'none');
        setValidCardNo(cardNo.length > 9 && cardNo.length < 20);
        setValidExpDate(expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/));
        setValidCVV(cvv.match(/^[0-9]{3,4}$/));
        if (!(hireChoiceId !== '' && hireChoiceId !== 'none')
            && cardNo.length > 9 && cardNo.length < 20
            && expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/)
            && cvv.match(/^[0-9]{3,4}$/)) {
            NotificationManager.error("Invalid Details Provided", "Error");
            return;
        }
        try {
            let request = await fetch(host + `api/Orders/${orderId}/extend`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    'hireOptionId': parseInt(hireChoiceId),
                }),
                mode: "cors"
            });
            let response = await request;
            if (response.status === 422) {
                NotificationManager.error("Scooter is currently unavailable.", "Error");
            } else if (response.status === 400) {
                NotificationManager.error("Please fill in all required fields.", "Error");
            } else if (response.status === 200) {
                NotificationManager.success("Extended Booking.", "Success");
                if ((!checkCardExists() || savedDetailsDeleted) && saveCard) {
                    cookies.set('cardNumber', cardNo, {path: '/'});
                    cookies.set('expiryDate', expiry, {path: '/'});
                    cookies.set('cvv', cvv, {path: '/'});
                    NotificationManager.success("Stored credit card details.", "Success");
                }
                navigate('/current-bookings');
            }
        } catch (error) {
            console.error(error);
        }
    }

    function checkCardExists() {
        return (cookies.get('cardNumber') && cookies.get('expiryDate') && cookies.get('cvv'));
    }

    function DisplayCost() {
        return (
            (isNaN(parseFloat(price))) ? null :
                (loading === '') ? null :
                    (discount) ?
                        <Row className="pb-2">
                            <Col>
                                {(hireChoiceId === '') ? null :
                                    <>
                                        <h5>Cost: £{(0.9 * parseFloat(price)).toFixed(2)}</h5>
                                        <Row className="pb-2">
                                            <Col className="text-end col-3 align-self-center">
                                                Discount:
                                            </Col>
                                            <Col>
                                                {discountType} (10%) applied
                                            </Col>
                                        </Row>
                                    </>
                                }
                            </Col>
                        </Row> :
                        <Row className="pb-2">
                            <Col>
                                {(hireChoiceId === '') ? <h5>Cost £</h5> : <h5>Cost £{parseFloat(price).toFixed(2)}</h5>
                                }
                            </Col>
                        </Row>
        )
    }

    return (
        <Container>
            <h5>Booking Details</h5>
            <Row className="pb-2">
                <Col className="text-end col-3 align-self-center">
                    Depot:
                </Col>
                <Col>
                    {(!baseOrder.scooter) ?
                        <> Loading depot... </> :
                        <Form.Control value={baseOrder.scooter.depoId} disabled />
                    }
                </Col>
            </Row>
            <Row className="pb-2">
                <Col className="text-end col-3 align-self-center">
                    Scooter:
                </Col>
                <Col>
                    {(!baseOrder.scooter) ?
                        <> Loading scooter... </> :
                        <Form.Control value={baseOrder.scooter.softScooterId} disabled />
                    }
                </Col>
            </Row>
            <Row className="pb-2">
                <Col className="text-end col-3 align-self-center">
                    Extension Period:
                </Col>
                <Col>
                    {(hireOptions === "") ? <>Loading extension periods...</> : <>
                        <Form.Select isInvalid={!validHireSlot} defaultValue="none" onChange={(e) => {
                            let value = e.target.value.split(',')
                            setHireChoiceId(value[0]);
                            setPrice(value[1])
                        }}>

                            <option value="none" key="none" disabled hidden>Select Extension Period</option>
                            {hireOptions.map((option, idx) => (
                                <option key={idx} value={[option.hireOptionId, option.cost]}>{option.name} -
                                    £{option.cost}</option>
                            ))}
                        </Form.Select>
                    </>
                    }
                </Col>
            </Row>
            <br/>
            <DisplayCost/>
            {!checkCardExists() || savedDetailsDeleted ?
                <>
                    <h5>Payment details</h5>
                    <Row className="pb-2 small-padding-top">
                        <Col className="text-end col-3 align-self-center">
                            Save Card Details:
                        </Col>
                        <Col>
                            <Form.Switch onClick={(e) =>
                                setSaveCard(e.target.checked)}/>
                        </Col>
                    </Row>
                    <Row className="pb-2 small-padding-top">
                        <Col className="text-end col-3 align-self-center">
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
                        <Col className="text-end col-3 align-self-center">
                            Expiry Date:
                        </Col>
                        <Col>
                            <Form.Control type="text" placeholder="MM/YY"
                                          isInvalid={!validExpDate}
                                          onInput={e => setExpiry(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">
                                Invalid Expiry Date
                            </Form.Control.Feedback>
                        </Col>
                    </Row>
                    <Row className="pb-2">
                        <Col className="text-end col-3 align-self-center">
                            CVV:
                        </Col>
                        <Col>
                            <Form.Control type="text" placeholder="123"
                                          isInvalid={!validCVV}
                                          onInput={e => setCVV(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">
                                Invalid CVV
                            </Form.Control.Feedback>
                        </Col>
                    </Row>
                </> : <>
                    <h5>Using stored payment details</h5>
                    <Row>
                        <Col className="text-end col-3 align-self-center">
                            Card Number:
                        </Col>
                        <Col>
                            **** ****
                            **** {cookies.get('cardNumber').slice(cookies.get('cardNumber').length - 4)}
                        </Col>
                    </Row>
                    <Row className="pb-2 ">
                        <Col className="text-end col-3 align-self-center">
                            Expiry Date:
                        </Col>
                        <Col>
                            {cookies.get('expiryDate')}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="offset-3">
                            <Button

                                variant="danger"
                                onClick={() => {
                                    cookies.remove('cardNumber');
                                    cookies.remove('expiryDate');
                                    cookies.remove('cvv');
                                    setSavedDetailsDeleted(true);
                                    NotificationManager.success("Deleted credit card details.", "Success");
                                }}>
                                Delete Card Details
                            </Button>
                        </Col>
                    </Row>
                </>
            }
            <br/>

            <Button className="float-right"
                    onClick={extendBooking}>Confirm Extension</Button>


        </Container>
    );
};