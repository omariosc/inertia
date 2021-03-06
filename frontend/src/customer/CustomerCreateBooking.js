/* Purpose of file: Allow a customer to create a new booking */

import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import {NotificationManager} from 'react-notifications';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import host from '../host';
import moment from 'moment';
import Cards from 'elt-react-credit-cards';
import 'elt-react-credit-cards/es/styles-compiled.css';
import {useAccount} from '../authorize';

/**
 * Renders the create booking page for the customer
 * @return {JSX.Element} Customer create booking page
 */
export default function CustomerCreateBooking() {
  const [account] = useAccount();
  const navigate = useNavigate();
  const [mapLocations, setMapLocations] = useState('');
  const [scooters, setScooters] = useState('');
  const [hireOptions, setHireOptions] = useState('');
  const [depotChoiceId, setDepotChoiceId] = useState('');
  const [scooterChoiceId, setScooterChoiceId] = useState('');
  const [hireChoiceId, setHireChoiceId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [price, setPrice] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCVV] = useState('');
  const [focus, setFocus] = useState('');
  const [validDepot, setValidDepot] = useState(true);
  const [validScooter, setValidScooter] = useState(true);
  const [validHireSlot, setValidHireSlot] = useState(true);
  const [validStartDate, setValidStartDate] = useState(true);
  const [validStartTime, setValidStartTime] = useState(true);
  const [validCardNo, setValidCardNo] = useState(true);
  const [validExpDate, setValidExpDate] = useState(true);
  const [validCVV, setValidCVV] = useState(true);
  const [discount, setDiscount] = useState(false);
  const [discountType, setDiscountType] = useState('');
  const [loading, setLoading] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [savedCardDetails, setSavedCardDetails] = useState(null);

  useEffect(() => {
    fetchHirePeriods();
    fetchDiscountStatus();
    fetchLocations();
    checkCardExists();
  }, []);

  useEffect(() => {
    fetchAvailableScooters();
  }, [startTime, startDate, hireChoiceId, depotChoiceId]);

  /**
   * Gets a list of locations from the backend server
   */
  async function fetchLocations() {
    try {
      const request = await fetch(host + 'api/Depos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });
      setMapLocations(await request.json());
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Checks if the customer is currently eligible for frequent user discount,
   * applies it and updates backend server if they are
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
   * Checks if the user is eligible for another type of discount,
   * e.g. student discount and applies the discount
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
   * Gets list of available hire lengths from backend server
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
   * Calculates the start time of the new booking
   * @return {string} booking start time in ISO format
   */
  function calcStartIso() {
    const hours = parseInt(startTime.slice(0, 2));
    const mins = parseInt(startTime.slice(3, 5));
    const bookingStart = new Date(startDate);
    bookingStart.setHours(hours, mins, 0, 0);
    return bookingStart.toISOString();
  }

  /**
   * Calculates the end time of the new booking
   * @return {string} booking end time in ISO format
   */
  function calcEndIso() {
    const hours = parseInt(startTime.slice(0, 2));
    const mins = parseInt(startTime.slice(3, 5));
    const bookingEnd = new Date(startDate);
    const duration = hireOptions.find(
        (x) => x.hireOptionId === parseInt(hireChoiceId)).durationInHours;
    bookingEnd.setHours(hours + duration, mins, 0, 0);
    return bookingEnd.toISOString();
  }

  /**
   * Gets list of available scooters for the new booking from the backend server
   */
  async function fetchAvailableScooters() {
    let valid = true;
    const validateFuncs = [
      validateTime,
      validateDate,
      validateDepot,
      validateHireSlot];
    validateFuncs.forEach((validateTerm) => {
      if (valid) {
        valid = validateTerm(false);
      } else {
        validateTerm(false);
      }
    });
    if (valid) {
      try {
        const requestString = host + 'api/Scooters/available/' + '?depoId=' +
            depotChoiceId + '&startTime=' + calcStartIso() + '&endTime=' +
            calcEndIso();
        const request = await fetch(requestString, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${account.accessToken}`,
          },
          mode: 'cors',
        });
        setScooters((await request.json()).sort(
            (a, b) => a.softScooterId - b.softScooterId));
      } catch (error) {
        console.error(error);
      }
    } else {
      setScooters('');
      setScooterChoiceId('');
    }
  }

  /**
   * Checks date of the new booking is valid
   * @param {boolean} stateChange Dynamically updates UI if true
   * @return {boolean} True if valid, false otherwise
   */
  function validateDate(stateChange) {
    const currentDate = new Date();
    const dStartDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);
    dStartDate.setHours(0, 0, 0, 0);
    const valid = currentDate.toString() !== 'Invalid Date' && currentDate <=
        dStartDate;
    if (stateChange) {
      setValidStartDate(valid);
    }
    return valid;
  }

  /**
   * Checks time of the new booking is valid
   * @param {boolean} stateChange Dynamically updates UI if true
   * @return {boolean} True if valid, false otherwise
   */
  function validateTime(stateChange) {
    let valid;
    if (startTime.length !== 5) {
      valid = false;
    } else {
      const hours = parseInt(startTime.slice(0, 2));
      const mins = parseInt(startTime.slice(3, 5));
      if (hours < 0 || hours > 23 || mins % 15 !== 0) {
        valid = false;
      } else {
        const currentDate = new Date();
        const dStartDate = new Date(startDate);
        currentDate.setSeconds(0, 0);
        dStartDate.setHours(hours, mins, 0, 0);
        valid = currentDate.toString() !== 'Invalid Date' && currentDate <=
            dStartDate;
      }
    }
    if (stateChange) {
      setValidStartTime(valid);
    }
    return valid;
  }

  /**
   * Checks depot of the new booking is valid
   * @param {boolean} stateChange Dynamically updates UI if true
   * @return {boolean} True if valid, false otherwise
   */
  function validateDepot(stateChange) {
    const valid = depotChoiceId !== '' && depotChoiceId !== 'none';
    if (stateChange) {
      setValidDepot(valid);
    }
    return valid;
  }

  /**
   * Checks scooter for the new booking is valid
   * @param {boolean} stateChange Dynamically updates UI if true
   * @return {boolean} True if valid, false otherwise
   */
  function validateScooter(stateChange) {
    const valid = scooterChoiceId !== '' && scooterChoiceId !== 'none';
    if (stateChange) {
      setValidScooter(valid);
    }
    return valid;
  }

  /**
   * Checks hire length of the new booking is valid
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
   * Checks card number of the new booking is valid
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
   * Checks expiry date of the card for the new booking is valid
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
   * Checks CVV of the card for the new booking is valid
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
   * If all validations pass, creates a new booking with the specified
   * information and updates backend server
   */
  async function createBooking() {
    let valid = true;
    const validateFuncs = [
      validateTime,
      validateDate,
      validateDepot,
      validateScooter,
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
          'startTime': startDate + 'T' + startTime,
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
          (/^\d+$/.test(expiry)) ?
              card.expiry = expiry.slice(0, 3) + '/' + expiry.slice(3) :
              card.expiry = expiry;
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
   * @return {boolean} True if card exists, false otherwise
   */
  function checkCardExists() {
    if (localStorage.getItem(account.id)) {
      setSavedCardDetails(JSON.parse(localStorage.getItem(account.id)));
    }
    return (!!localStorage.getItem(account.id));
  }

  /**
   * Parses expiry date and converts it into the correct format
   * @param {Event} e On key press event
   */
  function parseExpiry(e) {
    if (e.keyCode === 8) {
      setExpiry(e.target.value);
      return;
    }
    setExpiry(e.target.value);
    e.target.value = e.target.value.replace(
        /^([1-9]\/|[2-9])$/g, '0$1/', // 3 > 03/
    ).replace(
        /^(0[1-9]|1[0-2])$/g, '$1/', // 11 > 11/
    ).replace(
        /^([0-1])([3-9])$/g, '0$1/$2', // 13 > 01/3
    ).replace(
        /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2', // 141 > 01/41
    ).replace(
        /^([0]+)\/|[0]+$/g, '0', // 0/ > 0 and 00 > 0
    ).replace(
        /[^\d\/]|^[\/]*$/g, '', // To allow only digits and `/`
    ).replace(
        /\/\//g, '/', // Prevent entering more than 1 `/`
    );
    setExpiry(e.target.value);
  }

  /**
   * Shows total cost of the new booking
   * @return {JSX.Element} the cost element
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
                              <h5>Cost: ??{(0.9 * parseFloat(price)).toFixed(
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
                      <Col>Cost ??{(hireChoiceId === '') ? null :
                          `${parseFloat(price).toFixed(2)}`
                      }
                      </Col>
                    </Row>
    );
  }

  return (
    <Container>
      <Row className="mapMaxHeightRow">
        {(mapLocations === '') ? <Col>Loading map locations...</Col> :
              <Col className="box col=12">
                <MapContainer center={[
                  mapLocations[0].latitude,
                  mapLocations[0].longitude]} zoom={15}
                zoomControl={false} className="minimap-box">
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                  {mapLocations.map((location, index) => (
                    <Marker key={index}
                      position={[
                        location.latitude,
                        location.longitude]}
                      eventHandlers={{
                        click: () => {
                          setScooterChoiceId('');
                          setDepotChoiceId(location.depoId);
                        },
                      }}>
                      <Popup>
                        <Button className="disabled">
                          {location.name}
                        </Button>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </Col>
        }
      </Row>
      <br className="box"/>
      <h5>Booking Details</h5>
      <Row className="pb-2">
        <Col className="text-end col-3 align-self-center">
            Depot:
        </Col>
        <Col>
          {(mapLocations === '') ? <> Loading depots... </> :
                <Form.Select value={depotChoiceId} isInvalid={!validDepot}
                  onChange={(e) => {
                    setDepotChoiceId(e.target.value);
                    setScooterChoiceId('');
                  }}>
                  <option value="" key="none" disabled hidden>Select Depot
                  </option>
                  {mapLocations.map((depot, idx) => (
                    <option value={depot.depoId}
                      key={idx}>{depot.name}</option>
                  ))}
                </Form.Select>
          }
        </Col>
      </Row>
      <Row className="pb-2">
        <Col className="text-end col-3 align-self-center">
            Start Time:
        </Col>
        <Col>
          <Container className="p-0">
            <Row>
              <Col>
                <Form.Control type="date" isInvalid={!validStartDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                  }}/>
              </Col>
              <Col>
                <Form.Control type="time"
                  isInvalid={!validStartTime}
                  value={startTime}
                  onChange={(e) => {
                    let output = e.target.value.slice(0, 3);
                    let minutes = parseInt(
                        e.target.value.slice(3, 5));
                    if (minutes % 15 === 1) {
                      minutes = (minutes + 14) % 60;
                    } else if (minutes % 15 === 14) {
                      minutes = (minutes - 14);
                    } else if (minutes % 15 !== 0) {
                      minutes = (Math.round(minutes / 15) % 4) *
                                        15;
                    }
                    const minString = minutes.toString();
                    if (minString.length === 1) {
                      output += '0' + minString;
                    } else {
                      output += minString;
                    }
                    setStartTime(output);
                  }
                  }/>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
      <Row className="pb-2">
        <Col className="text-end col-3 align-self-center">
            Hire Period:
        </Col>
        <Col>
          {(hireOptions === '') ? <>Loading hire periods...</> : <>
            <Form.Select isInvalid={!validHireSlot} defaultValue="none"
              onChange={(e) => {
                const value = e.target.value.split(',');
                setHireChoiceId(value[0]);
                setPrice(value[1]);
              }}>

              <option value="none" key="none" disabled hidden>Select Hire
                  Period
              </option>
              {hireOptions.map((option, idx) => (
                <option key={idx} value={[
                  option.hireOptionId,
                  option.cost]}>{option.name} -
                      ??{option.cost}</option>
              ))}
            </Form.Select>
          </>
          }
        </Col>
      </Row>
      <Row className="pb-2">
        <Col className="text-end col-3 align-self-center">
            Scooter:
        </Col>
        <Col>

          <Form.Select
            value={scooterChoiceId}
            isInvalid={!validScooter}
            disabled={scooters === ''}
            onChange={(e) => {
              setScooterChoiceId(e.target.value);
            }}>
            {scooters === '' ?
                  <option value="" key="none" disabled hidden>Please fill in
                    other details</option> : <>
                    <option value="" key="none" disabled hidden>Select Scooter
                    </option>
                    {scooters.map((scooter, idx) => (
                      <option value={scooter.scooterId}
                        key={idx}>{scooter.softScooterId}</option>
                    ))}
                  </>
            }
          </Form.Select>

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
                    <Form.Control type="text" name="number"
                      placeholder="4000-1234-5678-9010"
                      maxlength="16"
                      isInvalid={!validCardNo}
                      onChange={(e) =>
                        setCardNo(
                            e.target.value.replace(/^\d$/, ''))}
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
                      maxlength="5"
                      isInvalid={!validExpDate}
                      onKeyDown={(e) => {
                        parseExpiry(e);
                      }}
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
                      maxlength="3"
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
                      onClick={(e) => setSaveCard(
                          e.target.checked)}/>
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
                    maxlength="16"
                    isInvalid={!validCardNo}
                    onChange={(e) =>
                      setCardNo(
                          e.target.value.replace(/^\d$/, ''))}
                    onFocus={(e) => setFocus(
                        e.target.name)}/>
                  <Form.Control.Feedback type="invalid">
                    Invalid Card Number
                  </Form.Control.Feedback>
                </Row>
                <Row className="small-padding-bottom">
                  Expiry Date:
                  <Form.Control type="text" name="expiry"
                    placeholder="MM/YY"
                    maxlength="5"
                    isInvalid={!validExpDate}
                    onChange={(e) => setExpiry(
                        e.target.value)}
                    onKeyDown={(e) => {
                      parseExpiry(e);
                    }}
                    onFocus={(e) => setFocus(
                        e.target.name)}/>
                  <Form.Control.Feedback type="invalid">
                    Invalid Expiry Date
                  </Form.Control.Feedback>
                </Row>
                <Row>
                  CVV:
                  <Form.Control type="text" name="cvc"
                    placeholder="123"
                    maxlength="3"
                    isInvalid={!validCVV}
                    onChange={(e) => setCVV(
                        e.target.value)}
                    onFocus={(e) => setFocus(
                        e.target.name)}/>
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
      <div className="text-center">
        <Button onClick={createBooking}>Confirm Booking</Button>
      </div>
      <br/>
      <div className="issue-filters-mobile">
      </div>
    </Container>
  );
};
