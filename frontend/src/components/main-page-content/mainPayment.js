import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import Cards from 'elt-react-credit-cards';
import React, {useEffect, useState} from 'react';
import {NotificationManager} from 'react-notifications';
import host from '../../host';
import {useNavigate, useParams} from 'react-router-dom';
import {useAccount} from '../../authorize';

/**
 * Creates the payment page for landing page
 * @return {JSX.Element}
 */
export default function MainPayment() {
  const {scooterChoiceId, hireChoiceId, startTime} = useParams();
  const [account] = useAccount();
  const navigate = useNavigate();
  const [cardNo, setCardNo] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCVV] = useState('');
  const [focus, setFocus] = useState('');
  const [validCardNo, setValidCardNo] = useState(true);
  const [validExpDate, setValidExpDate] = useState(true);
  const [validCVV, setValidCVV] = useState(true);
  const [saveCard, setSaveCard] = useState(false);
  const [savedCardDetails, setSavedCardDetails] = useState(null);

  useEffect(() => {
    checkCardExists();
  }, []);

  /**
   * Checks card number of the new booking is valid
   * @param {boolean} stateChange
   * @return {boolean}
   */
  function validateCardNo(stateChange) {
    if (savedCardDetails !== null) {
      return true;
    }
    const valid = cardNo.length > 9 && cardNo.length < 20;
    if (stateChange) {
      setValidCardNo(valid);
    }
    return valid;
  }

  /**
   * Checks expiry date of the card for the new booking is valid
   * @param {boolean} stateChange
   * @return {boolean}
   */
  function validateExpDate(stateChange) {
    if (savedCardDetails !== null) {
      return true;
    }
    const valid = expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/);
    if (stateChange) {
      setValidExpDate(valid);
    }
    return valid;
  }

  /**
   * Checks CVV of the card for the new booking is valid
   * @param {boolean} stateChange
   * @return {boolean}
   */
  function validateCVV(stateChange) {
    if (savedCardDetails !== null) {
      return true;
    }
    const valid = cvv.match(/^[0-9]{3,4}$/);
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
    let valid = true;
    const validateFuncs = [validateCardNo, validateCVV, validateExpDate];
    validateFuncs.forEach((validateTerm) => {
      if (valid) {
        valid = validateTerm(true);
      } else {
        validateTerm(true);
      }
    });
    if (!valid) {
      NotificationManager.error('Invalid Details Provided', 'Error');
      return;
    }
    try {
      const request = await fetch(host + 'api/Orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        body: JSON.stringify({
          'hireOptionId': parseInt(hireChoiceId),
          'scooterId': parseInt(scooterChoiceId),
          'startTime': startTime,
        }),
        mode: 'cors',
      });
      const response = await request;
      if (response.status === 422) {
        NotificationManager.error('Scooter is currently unavailable.', 'Error');
      } else if (response.status === 400) {
        NotificationManager.error('Please fill in all required fields.',
            'Error');
      } else if (response.status === 200) {
        NotificationManager.success('Created Booking.', 'Success');
        if (savedCardDetails === null && saveCard) {
          const card = {
            cardNumber: cardNo,
            expiryDate: expiry,
            cvv: cvv,
          };
          localStorage.setItem(account.id, JSON.stringify(card));
          NotificationManager.success('Stored credit card details.', 'Success');
        }
        navigate('/current-bookings');
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Check if a card is stored in local cookies
   * @return {boolean} If card exists
   */
  function checkCardExists() {
    if (localStorage.getItem(account.id)) {
      setSavedCardDetails(JSON.parse(localStorage.getItem(account.id)));
    }
    return (!!localStorage.getItem(account.id));
  }

  return (
    <div className={'content'}>
      <Container>
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
                      name={(account) ? account.name : ''}
                      number={cardNo}
                    />
                  </Row>
                  <Row className="pb-2 small-padding-top">
                    <Col className="text-end col-3 align-self-center">
                      Card Number:
                    </Col>
                    <Col className="text-end">
                      <Form.Control type="text" name="number"
                        placeholder="4000-1234-5678-9010"
                        isInvalid={!validCardNo}
                        onChange={(e) => setCardNo(e.target.value)}
                        onFocus={(e) => setFocus(e.target.name)}/>
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
                      <Form.Control type="text" name="expiry"
                        placeholder="MM/YY"
                        isInvalid={!validExpDate}
                        onChange={(e) => setExpiry(e.target.value)}
                        onFocus={(e) => setFocus(e.target.name)}/>
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
                        onChange={(e) => setCVV(e.target.value)}
                        onFocus={(e) => setFocus(e.target.name)}/>
                      <Form.Control.Feedback type="invalid">
                        Invalid CVV
                      </Form.Control.Feedback>
                    </Col>
                  </Row>
                </> :
                <>
                  <h5>Using stored payment details</h5>
                  <Row className="pb-2">
                    <Col className="text-end col-3 align-self-center">
                      Card Number:
                    </Col>
                    <Col>
                      **** ****
                      **** {savedCardDetails.cardNumber.slice(
                          savedCardDetails.cardNumber.length - 4)}
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
                          NotificationManager.success(
                              'Deleted credit card details.', 'Success');
                          setSavedCardDetails(null);
                        }}>
                        Delete Card Details
                      </Button>
                    </Col>
                  </Row>
                </>
          }
        </div>
        <div className="text-center large-padding-top">
          <Button onClick={createBooking}>Confirm Booking</Button>
        </div>

      </Container>
    </div>
  );
};
