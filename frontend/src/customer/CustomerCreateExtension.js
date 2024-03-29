/* Purpose of file: Allow a customer to extend one of their ongoing bookings */

import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import {NotificationManager} from 'react-notifications';
import host from '../host';
import moment from 'moment';
import Cards from 'elt-react-credit-cards';
import {useAccount} from '../authorize';

/**
 * Renders the customer extension page, where they are able to
 * extend a currently ongoing booking
 * @return {JSX.Element} Customer create extension page
 */
export default function CustomerCreateExtension() {
  const [account] = useAccount();
  const navigate = useNavigate();
  const {orderId} = useParams();
  const [baseOrder, setBaseOrder] = useState('');
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
  const [savedCardDetails, setSavedCardDetails] = useState(null);

  useEffect(() => {
    fetchOrderInfo();
    fetchHirePeriods();
    fetchDiscountStatus();
    checkCardExists();
  }, []);

  /**
   * Gets information of the specific order from the backend server
   */
  async function fetchOrderInfo() {
    try {
      const request = await fetch(host + `api/Orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        mode: 'cors',
      });
      const response = await request;
      if (response.status === 200) {
        setBaseOrder(await response.json());
      } else {
        navigate('/current-bookings');
        NotificationManager.error('Order does not exist', 'Error');
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Check if a user is eligible for frequent user status, applies the discount
   * and updates backend server if they are
   */
  async function getDiscountStatus() {
    try {
      const request = await fetch(host + `api/Users/${account.id}/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        mode: 'cors',
      });
      const response = await request.json();
      const thresholdDate = moment().subtract(1, 'week').toISOString();
      const recentBookings = response.filter(
          (e) => e.createdAt >= thresholdDate);
      let recentHours = 0;
      for (let i = 0; i < recentBookings.length; i++) {
        if (recentBookings[i].orderState !== 0 &&
            recentBookings[i].orderState !== 6) {
          recentHours += recentBookings[i].hireOption.durationInHours;
          if (recentBookings[i]['extensions'] != null) {
            for (let j = 0; j < recentBookings[i]['extensions'].length; j++) {
              // eslint-disable-next-line max-len
              recentHours += recentBookings[i]['extensions'][j].hireOption.durationInHours;
            }
          }
        }
      }
      if (recentHours >= 8) {
        setDiscount(true);
        setDiscountType('Frequent User');
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Checks if the user is eligible for any other discount types
   * (e.g. Student) and applies the discount if they are
   */
  async function fetchDiscountStatus() {
    try {
      const request = await fetch(host + `api/Users/${account.id}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        mode: 'cors',
      });
      const response = await request.json();
      if (response.userType === 0) {
        setDiscount(true);
        setDiscountType('Student');
      } else if (response.userType === 1) {
        setDiscount(true);
        setDiscountType('Senior');
      } else if (response.userType === 3) {
        setDiscount(true);
        setDiscountType('Frequent User');
      } else {
        await getDiscountStatus();
      }
      setLoading('complete');
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Gets list of available hire lengths from the backend server
   */
  async function fetchHirePeriods() {
    try {
      const request = await fetch(host + 'api/HireOptions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        mode: 'cors',
      });
      setHireOptions((await request.json()).sort((a, b) => a.cost - b.cost));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Checks that the chosen hire slot is valid
   * @param {boolean} stateChange Dynamically updates UI if true
   * @return {boolean} True if valid, false otherwise
   */
  function validateHireSlot(stateChange) {
    const valid = hireChoiceId !== '' && hireChoiceId !== 'none';
    if (stateChange) {
      setValidHireSlot(valid);
    }
    return valid;
  }

  /**
   * Checks that the card number for the order is valid
   * @param {boolean} stateChange Dynamically updates UI if true
   * @return {boolean} True if valid, false otherwise
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
   * Checks that the expiry date of the card is valid
   * @param {boolean} stateChange Dynamically updates UI if true
   * @return {boolean} True if valid, false otherwise
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
   * Checks that the CVV of the card is valid
   * @param {boolean} stateChange Dynamically updates UI if true
   * @return {boolean} True if valid, false otherwise
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
   * Extends the booking for the chosen amount of time and updates the
   * backend server
   */
  async function extendBooking() {
    let valid = true;
    const validateFuncs = [
      validateHireSlot,
      validateCardNo,
      validateCVV,
      validateExpDate];
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
      const request = await fetch(host + `api/Orders/${orderId}/extend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        body: JSON.stringify({
          'hireOptionId': parseInt(hireChoiceId),
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
        NotificationManager.success('Extended Booking.', 'Success');
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
   * Checks if a card is stored in local cookies
   * @return {boolean} True if card exists, false otherwise
   */
  function checkCardExists() {
    if (localStorage.getItem(account.id)) {
      ``;
      setSavedCardDetails(JSON.parse(localStorage.getItem(account.id)));
    }
    return (!!localStorage.getItem(account.id));
  }

  /**
   * Displays total cost of the extension to the customer
   * @return {JSX.Element} cost element
   */
  function DisplayCost() {
    return (
        (isNaN(parseFloat(price))) ? null :
            (loading === '') ? null :
                (discount) ?
                    <Row className="pb-2">
                      <Col>
                        {(hireChoiceId === '') ? null :
                            <>
                              <h5>Cost: £{(0.9 * parseFloat(price)).toFixed(
                                  2)}</h5>
                              <Row className="pb-2">
                                <Col
                                  className="text-end col-3 align-self-center">
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
                        {(hireChoiceId === '') ?
                            <h5>Cost £</h5> :
                            <h5>Cost £{parseFloat(price).toFixed(2)}</h5>
                        }
                      </Col>
                    </Row>
    );
  }

  return (
    <Container>
      <h5>Booking Details</h5>
      <Row className="pb-2">
        <Col className="text-end col-3 align-self-center">
            Depot:
        </Col>
        <Col>
          {(!baseOrder) ?
                <> Loading depot... </> :
                <Form.Control value={baseOrder.scooter.depo.name} disabled/>
          }
        </Col>
      </Row>
      <Row className="pb-2">
        <Col className="text-end col-3 align-self-center">
            Scooter:
        </Col>
        <Col>
          {(!baseOrder) ?
                <> Loading scooter... </> :
                <Form.Control value={baseOrder.scooter.softScooterId} disabled/>
          }
        </Col>
      </Row>
      <Row className="pb-2">
        <Col className="text-end col-3 align-self-center">
            Extension Period:
        </Col>
        <Col>
          {(hireOptions === '') ? <>Loading extension periods...</> : <>
            <Form.Select isInvalid={!validHireSlot} defaultValue="none"
              onChange={(e) => {
                const value = e.target.value.split(',');
                setHireChoiceId(value[0]);
                setPrice(value[1]);
              }}>

              <option value="none" key="none" disabled hidden>Select Extension
                  Period
              </option>
              {hireOptions.map((option, idx) => (
                <option key={idx} value={[
                  option.hireOptionId,
                  option.cost]}>{option.name} -
                      £{option.cost}</option>
              ))}
            </Form.Select>
          </>
          }
        </Col>
      </Row>
      <br/>
      <DisplayCost/>
      <div className="issue-filters">
        {savedCardDetails === null ?
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
                <Row className="small-padding-bottom">
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
                    <Form.Control type="text" name="expiry" placeholder="MM/YY"
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
      <div className="issue-filters-mobile">
        {savedCardDetails === null ?
              <>
                <h5>Payment details</h5>
                <Row className="small-padding-bottom">
                  Save Card Details:
                  <Col>
                    <Form.Switch
                      onClick={(e) => setSaveCard(e.target.checked)}/>
                  </Col>
                </Row>
                <Row
                  className="small-padding-bottom customer-create-booking-card">
                  <Cards
                    cvc={cvv}
                    expiry={expiry}
                    focused={focus}
                    name={account.name}
                    number={cardNo}
                  />
                </Row>
                <Row className="small-padding-bottom">
                  Card Number:
                  <Form.Control type="text" name="number"
                    placeholder="4000-1234-5678-9010"
                    isInvalid={!validCardNo}
                    onChange={(e) => setCardNo(e.target.value)}
                    onFocus={(e) => setFocus(e.target.name)}/>
                  <Form.Control.Feedback type="invalid">
                    Invalid Card Number
                  </Form.Control.Feedback>
                </Row>
                <Row className="small-padding-bottom">
                  Expiry Date:
                  <Form.Control type="text" name="expiry" placeholder="MM/YY"
                    isInvalid={!validExpDate}
                    onChange={(e) => setExpiry(e.target.value)}
                    onFocus={(e) => setFocus(e.target.name)}/>
                  <Form.Control.Feedback type="invalid">
                    Invalid Expiry Date
                  </Form.Control.Feedback>
                </Row>
                <Row>
                  CVV:
                  <Form.Control type="text" name="cvc" placeholder="123"
                    isInvalid={!validCVV}
                    onChange={(e) => setCVV(e.target.value)}
                    onFocus={(e) => setFocus(e.target.name)}/>
                  <Form.Control.Feedback type="invalid">
                    Invalid CVV
                  </Form.Control.Feedback>
                </Row>
              </> :
              <>
                <h5>Using stored payment details</h5>
                <p>Card Number: **** ****
                  **** {savedCardDetails.cardNumber.slice(
                    savedCardDetails.cardNumber.length - 4)} </p>
                <p>Expiry Date: {savedCardDetails.expiryDate} </p>
                <Button
                  variant="danger"
                  className="float-right"
                  onClick={() => {
                    localStorage.removeItem(account.id);
                    NotificationManager.success(
                        'Deleted credit card details.', 'Success');
                    setSavedCardDetails(null);
                  }}>
                  Delete Card Details
                </Button>
                <br/>
                <br/>
              </>
        }
      </div>
      <br/>
      <Button className="float-right"
        onClick={extendBooking}>Confirm Extension</Button>
      <br/>
    </Container>
  );
};
