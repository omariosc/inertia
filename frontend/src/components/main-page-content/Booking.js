import {Button, Col, Container, Form, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import host from "../../host";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useAccount} from "../../authorize";
import "../../MainPage.css"

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
    const [validScooter, setValidScooter] = useState(true);
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

    // Fetches the depots.
    async function fetchLocations() {
        try {
            let request = await fetch(host + "api/Depos", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                mode: "cors"
            });
            setDepots(await request.json());
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Gets list of available hire lengths from backend server
     */
    async function fetchHirePeriods() {
        try {
            let request = await fetch(host + "api/HireOptions", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                mode: "cors"
            });
            setHireOptions((await request.json()).sort((a, b) => a.cost - b.cost));
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Calculates the start time of the new booking
     */
    function calcStartIso() {
        let hours = parseInt(startTime.slice(0, 2));
        let mins = parseInt(startTime.slice(3, 5));
        let bookingStart = new Date(startDate);
        bookingStart.setHours(hours, mins, 0, 0);
        return bookingStart.toISOString()
    }

    /**
     * Calculates the end time of the new booking
     */
    function calcEndIso() {
        let hours = parseInt(startTime.slice(0, 2));
        let mins = parseInt(startTime.slice(3, 5));
        let bookingEnd = new Date(startDate);
        let duration = hireOptions.find(x => x.hireOptionId === parseInt(hireChoiceId)).durationInHours;
        bookingEnd.setHours(hours + duration, mins, 0, 0);
        return bookingEnd.toISOString()
    }

    /**
     * Checks date of the new booking is valid
     */
    function validateDate(stateChange) {
        let currentDate = new Date();
        let dStartDate = new Date(startDate);
        currentDate.setHours(0, 0, 0, 0);
        dStartDate.setHours(0, 0, 0, 0);
        let valid = currentDate.toString() !== "Invalid Date" && currentDate <= dStartDate;
        if (stateChange) {
            setValidStartDate(valid);
        }
        return valid;
    }

    /**
     * Checks time of the new booking is valid
     */
    function validateTime(stateChange) {
        let valid;
        if (startTime.length !== 5) {
            valid = false;
        } else {
            let hours = parseInt(startTime.slice(0, 2));
            let mins = parseInt(startTime.slice(3, 5));
            if (hours < 0 || hours > 23 || mins % 15 !== 0) {
                valid = false;
            } else {
                let currentDate = new Date();
                let dStartDate = new Date(startDate);
                currentDate.setSeconds(0, 0);
                dStartDate.setHours(hours, mins, 0, 0);
                valid = currentDate.toString() !== "Invalid Date" && currentDate <= dStartDate;
            }
        }
        if (stateChange) {
            setValidStartTime(valid);
        }
        return valid;
    }

    /**
     * Checks hire length of the new booking is valid
     */
    function validateHireSlot(stateChange) {
        let valid = hireChoiceId !== '' && hireChoiceId !== 'none';
        if (stateChange) {
            setValidHireSlot(valid);
        }
        return valid;
    }

    /**
     * Gets list of available scooters for the new booking from the backend server
     */
    async function fetchAvailableScooters() {
        let valid = true
        let validateFuncs = [validateTime, validateDate, validateHireSlot]
        validateFuncs.forEach((validateTerm) => {
            if (valid) {
                valid = validateTerm(false);
            } else {
                validateTerm(false);
            }
        })
        if (valid) {
            try {
                let requestString = host + "api/Scooters/available/" + "?depoId=" + depotChoiceId + "&startTime=" + calcStartIso() + "&endTime=" + calcEndIso()
                let request = await fetch(requestString, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    mode: "cors"
                });
                setScooters((await request.json()).sort((a, b) => a.softScooterId - b.softScooterId));
            } catch (error) {
                console.error(error);
            }
        } else {
            setScooters("");
            setScooterChoiceId("");
        }
    }



    return (
        <div className={"content"}>
            <Container className={"p-2"}>
                <Row className="text-center">
                    <h5>Booking Details</h5>
                    <br/>
                    <br/>
                </Row>
                <Row className="pb-2">
                    <Col className="text-end col-3 align-self-center">
                        Depot:
                    </Col>
                    <Col>
                        {!(depots && depotChoiceId) ? <p> Loading depots </p> :
                            <Form.Control type="text" value={depots.find(() => {
                                return depots.depoId = depotChoiceId
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
                            <Row>
                                <Col>
                                    <Form.Control type="date" isInvalid={!validStartDate} onChange={(e) => {
                                        setStartDate(e.target.value);
                                    }}/>
                                </Col>
                                <Col>
                                    <Form.Control type="time"
                                                  isInvalid={!validStartTime}
                                                  value={startTime}
                                                  onChange={(e) => {
                                                      let output = e.target.value.slice(0, 3);
                                                      let minutes = parseInt(e.target.value.slice(3, 5));
                                                      if (minutes % 15 === 1) {
                                                          minutes = (minutes + 14) % 60
                                                      } else if (minutes % 15 === 14) {
                                                          minutes = (minutes - 14)
                                                      } else if (minutes % 15 !== 0) {
                                                          minutes = (Math.round(minutes / 15) % 4) * 15
                                                      }
                                                      let minString = minutes.toString();
                                                      if (minString.length === 1) {
                                                          output += "0" + minString;
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
                <Row className="pb-2">
                    <Col className="text-end col-3 align-self-center">
                        Scooter:
                    </Col>
                    <Col>
                        <Form.Select
                            value={scooterChoiceId}
                            isInvalid={!validScooter}
                            disabled={scooters === ""}
                            onChange={(e) => {
                                setScooterChoiceId(e.target.value);
                            }}>
                            {scooters === "" ?
                                <option value="" key="none" disabled hidden>Please fill in other details</option> : <>
                                    <option value="" key="none" disabled hidden>Select Scooter</option>
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
                <Row className={"text-center"}>
                    <Col className={"col-4 offset-1"}>
                        <Button className="text-center btn-danger" onClick={() => {
                            navigate("booking");
                        }
                        }>Cancel Booking</Button>
                    </Col>
                    <Col className={"col-4 offset-1"}>
                        <Button className="text-center" disabled={!(scooterChoiceId !== "")} onClick={() => {
                            if (account) {
                                console.log(account);
                                navigate(`../payment/${scooterChoiceId}/${hireChoiceId}/${startDate + "T" + startTime}`);
                            } else {
                                console.log(account);
                                navigate(`../authentication/${scooterChoiceId}/${hireChoiceId}/${startDate + "T" + startTime}`);
                            }
                        }
                        }>Book Scooter</Button>
                    </Col>
                </Row>
                <br/>
            </Container>
        </div>
    )
}