import React from "react";
import {Card, Col, Row, Table} from "react-bootstrap";
import "./AccountDetailsPage.css"

function PaymentDetails(props) {
    const cardDetails = [["Visa", "****3245", "H Align"], ["Mastercard", "****2346", "Matt Meringue"]]
    cardDetails.push(["Add a payment method", "", ""])

    const colorMappings = {
        "Visa" : "light",
        "Mastercard" : "dark",
        "Add a payment method" : "light"
    }
    const borderMappings= {
        "Visa" : "cadetBlue",
        "Mastercard" : "",
        "Add a payment method" : "dark"
    }

    const textMappings= {
        "Visa" : "dar",
        "Mastercard" : "white",
        "Add a payment method" : "dark"
    }

    cardClicked = () => {

    }

    return (
    <>
        <h4>Payment Details</h4>
        <Row>
            {cardDetails.map((card, idx) => (
                <Col>
                    <Card
                        onClick={onClick} style={{cursor:"pointer"}}

                        bg={colorMappings[card[0]]}
                        border={borderMappings[card[0]]}
                        key={idx}
                        text={textMappings[card[0]]}
                        style={{width: '18rem'}}
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
                </Col>
            ))}
        </Row>
    </>
    );

}

export default PaymentDetails;
