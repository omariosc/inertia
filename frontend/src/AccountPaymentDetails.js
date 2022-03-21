import React, {useRef} from "react";
import {Card, Col, Overlay, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css"

function PaymentDetails() {
    const cardDetails = [["Visa", "****3245", "H Align"], ["Mastercard", "****2346", "Matt Meringue"]]
    cardDetails.push(["Add a payment method", "", ""])
    const colorMappings = {
        "Visa": "light",
        "Mastercard": "dark",
        "Add a payment method": "light"
    }
    const borderMappings = {
        "Visa": "cadetBlue",
        "Mastercard": "",
        "Add a payment method": "dark"
    }
    const textMappings = {
        "Visa": "dar",
        "Mastercard": "white",
        "Add a payment method": "dark"
    }
    const target = useRef(null)

    function sayHello() {
        alert("Hello")
    }

    return (
        <>
            <h4>Payment Details</h4>
            <Row>
                {cardDetails.map((card, idx) => (
                    <Col>
                        <Card
                            ref={target}
                            onClick={sayHello}
                            style={{cursor: "pointer", width: '18rem'}}
                            bg={colorMappings[card[0]]}
                            border={borderMappings[card[0]]}
                            key={idx}
                            text={textMappings[card[0]]}
                            className={card[0]}
                        >
                            <Card.Body>
                                <Card.Title>{card[0]}</Card.Title>
                                <Card.Text>
                                    <Row>
                                        <Col>
                                            {card[1]}
                                        </Col>
                                        <Col className={"d-flex justify-content-end"}>
                                            {card[2]}
                                        </Col>
                                    </Row>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Overlay target={target.current} show={true} placement="right">
                            {({
                                  placement, arrowProps, show: _show,
                                  popper, ...props
                              }) => (
                                <div
                                    {...props}
                                    style={{
                                        backgroundColor: 'rgba(255, 100, 100, 0.85)',
                                        padding: '2px 10px',
                                        color: 'white',
                                        borderRadius: 3,
                                        ...props.style,
                                    }}
                                >
                                    Simple tooltip
                                </div>
                            )}
                        </Overlay>
                    </Col>
                ))}
            </Row>
        </>
    );
}

export default PaymentDetails;
