import React from "react";
import {InputGroup, Button, Modal, Form, Container, Row, Col} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css"
import {CardElement, useElements, useStripe,} from "@stripe/react-stripe-js";
import host from "./host";

function Order({show, onHide, location, loggedIn}) {
    const stripe = useStripe();
    const elements = useElements();

    async function onSubmit() {
        try {
            const request = await fetch(host + "api/create-payment-intent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "items": {"id": "string"}
                }),
                mode: "cors"
            });
            const {data: clientSecret} = await request.json();
            const cardElement = elements.getElement(CardElement)
            const paymentMethodRequest = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement
            })
            const confirmedCardPayment = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethodRequest.paymentMethod.id,
            })
        } catch (e) {
            console.log(e)
        }

    }

    return (
        <Modal
            show={show}
            centered
        >
            <Modal.Header>
                <Modal.Title>
                    Scooter from {location}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Container>
                        {loggedIn ?
                            <Row>
                                <Col>
                                    <p>Logged in as username</p>
                                </Col>
                            </Row>
                            : <Row>
                                <Col>
                                    <InputGroup>
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control type="email" placeholder="user@example.com"/>
                                    </InputGroup>
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col>
                                <InputGroup>
                                    <Form.Label>Date:</Form.Label>
                                    <Form.Control type="date"/>
                                </InputGroup>
                            </Col>
                            <Col>
                                <InputGroup>
                                    <Form.Label>Time:</Form.Label>
                                    <Form.Control type="time"/>
                                </InputGroup>
                            </Col>
                        </Row>
                    </Container>


                    {/*Hardcoded time lengths, could be worthwhile adding api request to get options,
                    and to validate options in backend*/}
                    <div key={"lengthRadioButtons"}>
                        <Form.Check
                            type="radio"
                            id="1-hour"
                            label="1 hour"
                            name="lengthRadioButton"
                        />
                        <Form.Check
                            type="radio"
                            id="4-hour"
                            label="4 hours"
                            name="lengthRadioButton"
                        />
                        <Form.Check
                            type="radio"
                            id="24-hour"
                            label="1 day"
                            name="lengthRadioButton"
                        />
                    </div>
                    <CardElement/>
                    <Form.Switch
                        type="switch"
                        id="custom-switch"
                        label="Remember card details"
                    />

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={() => {
                    onSubmit();
                    onHide()
                }}>
                    Order
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

//Temp before merging with login intergration
Order.defaultProps =
    {
        loggedIn: false
    }
//

export default Order;