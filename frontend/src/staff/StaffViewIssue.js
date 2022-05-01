/*
	Purpose of file: Open the specific overview of an issue to
	access detailed information about it
*/

import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import { useAccount } from '../authorize';
import getAge from "./getAge";
import host from '../host';
import priorities from "./priorities";

/**
 * Renders the detailed view of a specific issue
 * @returns View of a specific issue
 */
export default function StaffViewIssue() {
    const navigate = useNavigate();
    let {id} = useParams();
    const [account] = useAccount();
    const [accountName, setAccountName] = useState('');
    const [accountRole, setAccountRole] = useState('');
    const [issue, setIssue] = useState('');
    const [priority, setPriority] = useState('');

    useEffect(() => {
        fetchIssueDetails();
    }, []);

    /**
		 * Gets the issue information from the backend server
		 */
    async function fetchIssueDetails() {
        try {
            let request = await fetch(host + `api/admin/Issues/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                mode: "cors"
            });
            let response = await request.json();
            if (response.errorCode) {
                NotificationManager.error("Could not load issue.", "Error");
                navigate('/issues');
            } else {
                setIssue(response);
                await fetchAccount(response.accountId);
            }
        } catch (error) {
            NotificationManager.error("Could not load issue.", "Error");
            navigate('/issues');
            console.error(error);
        }
    }

    /**
		 * Gets information about the account which raised the issue
		 * from the backend server
		 * @param {number} accountId The account that created the issue
		 */
    async function fetchAccount(accountId) {
        let accountRequest = await fetch(host + `api/admin/Users/${accountId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${account.accessToken}`
            },
            mode: "cors"
        });
        let accountResponse = await accountRequest.json();
        setAccountName(accountResponse.name);
        setAccountRole(accountResponse.role);
    }

    /**
		 * Marks an issue as resolved
		 */
    async function resolve() {
        try {
            await fetch(host + `api/admin/Issues/${id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                body: JSON.stringify({
                    "resolution": "Resolved"
                }),
                mode: "cors"
            });
            NotificationManager.success("Resolved issue.", "Success");
            navigate('/issues');
        } catch (error) {
            console.error(error);
        }
    }

    /**
		 * Changes the priority of a specific issue
		 * @returns Null if no priority is selected
		 */
    async function editPriority() {
        if (priority === '' || priority === 'none') {
            NotificationManager.error("You must select a priority.", "Error");
            return;
        }
        try {
            await fetch(host + `api/admin/Issues/${id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                body: JSON.stringify({
                    "priority": parseInt(priority)
                }),
                mode: "cors"
            });
            NotificationManager.success("Modified issue priority.", "Success");
            navigate('/issues');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" onClick={() => {(account.role === "2") ? navigate("/dashboard" ): navigate("/home")}}>Home
                </a> &gt; <a className="breadcrumb-list" onClick={() => {navigate("/issues")}}>Issues</a> &gt; <b>
                <a className="breadcrumb-current" onClick={() => {navigate(`/issues/${id}`)}}>#{id}</a></b>
            </p>
            {(issue === "") ? <p>Loading issue details...</p> :
                <>
                    <div className="issue-view">
                        <h5 id="pageName">Issue #{id}: {issue.title}</h5>
                        <hr className="issue-divider"/>
                        <Container>
                            <Row>
                                <Col xs={6} xg={7} xl={8}>
                                    [{(accountRole === "1") ? "Employee" : "Customer"}] {accountName} ·
                                    created {getAge(issue.dateOpened + "+00:00")} ago
                                </Col>
                                <Col xs={2}/>
                                <Col className={`issue-label-${issue.priority}`}>
                                    <b className="issue-text">{priorities[issue.priority]}</b>
                                </Col>
                            </Row>
                        </Container>
                        <hr className="issue-divider"/>
                        <Container>
                            <p>Description: {issue.content}</p>
                            <br/>
                            <Row>
                                <Col>
                                    <Button onClick={resolve}>Mark as Resolved</Button>
                                </Col>
                                <Col xs={'auto'}>
                                    <Row>
                                        <Col xs={'auto'}>
                                            <Form.Select defaultValue="none" onChange={(e) => {
                                                setPriority(e.target.value)
                                            }}>
                                                <option value="none" key="none" disabled hidden>
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
                    </div>
                    <div className="issue-view-mobile">
                        <Container>
                            <br/>
                            <Row>
                                <Col xs={6} xg={7} xl={8}>
                                    <h5>Issue #{id}: {issue.title}</h5>
                                </Col>
                                <Col xs={2}/>
                                <Col className={`issue-label-${issue.priority}`}>
                                    <b className="issue-text">{priorities[issue.priority]}</b>
                                </Col>
                            </Row>
                            [{(accountRole === "1") ? "Employee" : "Customer"}] {accountName} ·
                            created {getAge(issue.dateOpened + "+00:00")} ago
                        </Container>
                        <hr className="issue-divider"/>
                        <Container>
                            <p>Description: {issue.content}</p>
                        </Container>
                        <hr className="issue-divider"/>
                        <Container>
                            <Row>
                                <Button onClick={resolve}>Mark as Resolved</Button>
                            </Row>
                            <br/>
                            <Row>
                                <Form.Select defaultValue="none" onChange={(e) => {
                                    setPriority(e.target.value)
                                }}>
                                    <option value="none" key="none" disabled hidden>
                                        Select priority
                                    </option>
                                    {priorities.map((priority, idx) => (
                                        (issue.priority !== idx && priority !== "None") ?
                                            <option value={idx} key={idx}>{priority}</option> : null
                                    ))}
                                </Form.Select>
                            </Row>
                            <br/>
                            <Row>
                                <Button onClick={editPriority}>
                                    {(priority === "" || priority === "none") ? "Change" : <>
                                        {(issue.priority > parseInt(priority)) ? "Resolve" : "Escalate"} </>
                                    }
                                </Button>
                            </Row>
                        </Container>
                    </div>
                </>
            }
        </>
    );
};