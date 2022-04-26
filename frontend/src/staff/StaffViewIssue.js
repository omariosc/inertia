import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import host from '../host';
import priorities from "./priorities";
import Cookies from "universal-cookie";
import getAge from "./getAge";

export default function StaffViewIssue() {
    let navigate = useNavigate();
    let {id} = useParams();
    const cookies = new Cookies();
    const [accountName, setAccountName] = useState('');
    const [accountRole, setAccountRole] = useState('');
    const [issue, setIssue] = useState('');
    const [priority, setPriority] = useState('');

    useEffect(() => {
        fetchIssueDetails();
    }, []);

    // Gets the issue details.
    async function fetchIssueDetails() {
        try {
            let request = await fetch(host + `api/admin/Issues/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let response = await request.json();
            console.log(response)
            if (response.errorCode) {
                navigate('/issues');
            } else {
                setIssue(response);
                await fetchAccount(response.accountId);
            }
        } catch (error) {
            navigate('/issues');
            console.error(error);
        }
    }

    // Gets the account name and role for account which made issue.
    async function fetchAccount(accountId) {
        let accountRequest = await fetch(host + `api/admin/Users/${accountId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${cookies.get('accessToken')}`
            },
            mode: "cors"
        });
        let accountResponse = await accountRequest.json();
        setAccountName(accountResponse.name);
        setAccountRole(accountResponse.role);
    }

    // Marks issue as resolved.
    async function resolve() {
        try {
            await fetch(host + `api/admin/Issues/${id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    "resolution": "Resolved"
                }),
                mode: "cors"
            });
            navigate('/issues');
        } catch (error) {
            console.error(error);
        }
    }

    // Changes issue priority.
    async function editPriority() {
        if (priority === '' || priority === 'none') {
            alert("You must select a priority.");
            return;
        }
        try {
            await fetch(host + `api/admin/Issues/${id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    "priority": parseInt(priority)
                }),
                mode: "cors"
            });
            navigate('/issues');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home
                </a> > <a className="breadcrumb-list" href="/issues">Issues</a> > <b>
                <a className="breadcrumb-current" href={`/issues/${id}`}>#{id}</a></b>
            </p>
            {(issue === "") ? <p>Loading issue details...</p> :
                <>
                    <h5 id="pageName">Issue #{id}: {issue.title}</h5>
                    <hr className="issue-divider"/>
                    <Container>
                        <Row>
                            <Col xs={6} xg={7} xl={8}>
                                [{(accountRole === "1") ? "Employee" : "Customer"}] {accountName} ·
                                created {getAge(issue.dateOpened + "+00:00")} ago
                            </Col>
                            <Col xs={3}/>
                            <Col className={`issue-label-${issue.priority}`}>
                                <b className="issue-text">{priorities[issue.priority]}</b>
                            </Col>
                        </Row>
                    </Container>
                    <hr className="issue-divider"/>
                    <Container>
                        <p>{issue.content}</p>
                        <br/>
                        <Row>
                            <Col xs={5} md={6} xg={7} xl={9}>
                                <Button onClick={resolve}>Mark as Resolved</Button>
                            </Col>
                            <Col xs={'auto'}>
                                <Row>
                                    <Col xs={'auto'}>
                                        <Form.Select onChange={(e) => {
                                            setPriority(e.target.value)
                                        }}>
                                            <option value="none" key="none" selected disabled hidden>
                                                Select priority
                                            </option>
                                            {priorities.map((priority, idx) => (
                                                (issue.priority !== idx && priority !== "None") ?
                                                    <option value={idx} key={idx}>{priority}</option> : null
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col xs={'auto'}>
                                        <Button onClick={editPriority}>
                                            {(priority === "" || priority === "none") ? "Change" : <>
                                                {(issue.priority > parseInt(priority)) ? "Resolve" : "Escalate"} </>
                                            }
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </>
            }
        </>
    );
};