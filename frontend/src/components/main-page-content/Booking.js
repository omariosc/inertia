import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import host from '../../host';
import {useNavigate, useParams} from 'react-router-dom';
import {useAccount} from '../../authorize';
import '../../MainPage.css';

/**
 * Creates the landing page booking element
 * @return {JSX.Element}
 */
export default function Booking() {
  const [account] = useAccount();
  const params = useParams();
  const navigate = useNavigate();
  const depotChoiceId = params.depoId;
  const [depots, setDepots] = useState();
  const [scooters, setScooters] = useState('');
  const [hireOptions, setHireOptions] = useState('');
  const [validHireSlot, setValidHireSlot] = useState(true);
  const [validStartDate, setValidStartDate] = useState(true);
  const [validStartTime, setValidStartTime] = useState(true);
  const [hireChoiceId, setHireChoiceId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [scooterChoiceId, setScooterChoiceId] = useState('');

  useEffect(() => {
    fetchLocations();
    fetchHirePeriods();
  }, []);

  useEffect(() => {
    fetchAvailableScooters();
  }, [startTime, startDate, hireChoiceId]);

  /**
   * Fetches depots
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
      setDepots(await request.json());
    } catch (e) {
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
   * @return {string} Booking start time in ISO format
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
   * @return {string} Booking end time in ISO format
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
   * Checks date of the new booking is valid
   * @param {boolean} stateChange
   * @return {boolean} If booking is valid
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
   * @param {boolean} stateChange
   * @return {boolean} If time is valid
   */
  function validateTime(stateChange) {
    let valid;
    if (startTime.length !== 5) {
      valid = false;
    } else {
      const hours = parseInt(startTime.slice(0, 2));
      const minutes = parseInt(startTime.slice(3, 5));
      if (hours < 0 || hours > 23 || minutes % 15 !== 0) {
        valid = false;
      } else {
        const currentDate = new Date();
        const dStartDate = new Date(startDate);
        currentDate.setSeconds(0, 0);
        dStartDate.setHours(hours, minutes, 0, 0);
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
   * Checks hire length of the new booking is valid
   * @param {boolean} stateChange
   * @return {boolean} If hire option is valid
   */
  function validateHireSlot(stateChange) {
    const valid = hireChoiceId !== '' && hireChoiceId !== 'none';
    if (stateChange) {
      setValidHireSlot(valid);
    }
    return valid;
  }

  /**
   * Gets list of available scooters for the new booking from the backend server
   */
  async function fetchAvailableScooters() {
    let valid = true;
    const validateFuncs = [validateTime, validateDate, validateHireSlot];
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

  return (
    <div className={'content'}>
      <Container className={'p-2'}>
        <Row className="text-center">
          <h5>Booking Details</h5>
          <br/>
          <br/>
        </Row>
        <Row className="pb-2 minRow align-self-center">
          <Col className="text-end col-3 align-self-center">
              Depot:
          </Col>
          <Col className={'align-self-center'}>
            {!(depots && depotChoiceId) ? <p> Loading depots </p> :
                  <Form.Control type="text" value={depots.find(() => {
                    return depots.depoId = depotChoiceId;
                  }).name}
                  disabled/>}
          </Col>
        </Row>
        <Row className="pb-2">
          <Col className="text-end col-3 align-self-center">
              Start Time:
          </Col>
          <Col>
            <Container className="p-0">
              <Row className={'minRow align-self-center'}>
                <Col className={'align-self-center'}>
                  <Form.Control type="date" isInvalid={!validStartDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                    }}/>
                </Col>
              </Row>
              <Row className={'minRow align-self-center'}>
                <Col className={'align-self-center'}>
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
        <Row className="pb-2 minRow">
          <Col className="text-end col-3 align-self-center">
              Hire Period:
          </Col>
          <Col className={'align-self-center'}>
            {(hireOptions === '') ? <>Loading hire periods...</> : <>
              <Form.Select isInvalid={!validHireSlot} defaultValue="none"
                onChange={(e) => {
                  const value = e.target.value.split(',');
                  setHireChoiceId(value[0]);
                }}>

                <option value="none" key="none" disabled hidden>Select Hire
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
        <Row className="pb-2 minRow">
          <Col className="text-end col-3 align-self-center">
              Scooter:
          </Col>
          <Col className={'align-self-center'}>
            <Form.Select
              value={scooterChoiceId}
              disabled={scooters === ''}
              onChange={(e) => {
                setScooterChoiceId(e.target.value);
              }}>
              {scooters === '' ?
                    <option value="" key="none" disabled hidden>Please fill in
                      other details</option> : <>
                      <option value="" key="none" disabled hidden>Select
                        Scooter
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
        <br/>
        <Row className={'text-center minRow'}>
          <Col className={'col-4 offset-1'}>
            <Button className="text-center btn-danger" onClick={() => {
              navigate('booking');
            }
            }>Cancel Booking</Button>
          </Col>
          <Col className={'col-4 offset-1'}>
            <Button className="text-center"
              disabled={!(scooterChoiceId !== '')} onClick={() => {
                if (account) {
                  navigate(
                      // eslint-disable-next-line max-len
                      `../payment/${scooterChoiceId}/${hireChoiceId}/${startDate +
                      'T' + startTime}`);
                } else {
                  navigate(
                      // eslint-disable-next-line max-len
                      `../authentication/${scooterChoiceId}/${hireChoiceId}/${startDate +
                      'T' + startTime}`);
                }
              }
              }>Book Scooter</Button>
          </Col>
        </Row>
        <br/>
      </Container>
    </div>
  );
}
