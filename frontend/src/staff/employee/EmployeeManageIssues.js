import React, {useEffect, useState} from "react";
import {Button, Card, Col, Container, Form, FormSelect, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import priorities from "../priorities";
import host from "../../host";
import Cookies from "universal-cookie";

export default function EmployeeManageIssues() {
    const cookies = new Cookies();
    const [issues, setIssues] = useState('');
    const [priority, setPriority] = useState('');

    useEffect(() => {
        fetchIssues();
    }, []);

    async function fetchIssues(sortOption = null) {
        try {
            let request = await fetch(host + "api/admin/Issues/?closed=false", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let response = await request.json();
            const sortFunctions = {
                '1': (a, b) => b.issueId - a.issueId,
                '2': (a, b) => a.issueId - b.issueId,
                '3': (a, b) => a.priority - b.priority,
                '4': (a, b) => b.priority - a.priority
            }
            setIssues(response.sort(sortFunctions[sortOption]));
        } catch (error) {
            console.error(error);
        }
    }

    async function editIssue(id, changePriority = false) {
        const requestBody = (changePriority ?
            {"priority": parseInt(priority)} :
            {"resolution": "Resolved"})
        if (changePriority === true && (priority === '' || priority === 'none')) {
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
                body: JSON.stringify(requestBody),
                mode: "cors"
            });
            await fetchIssues();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home
                </a> > <a className="breadcrumb-list" href="/submit-issue">Issues</a> > <b>
                <a className="breadcrumb-current" href="/manage-issue">Manage Issue</a></b>
            </p>
            <h3 id="pageName">Manage Issues</h3>
            <hr id="underline"/>
            <br/>
            <Container>
                {(issues.length === 0) ?
                    <p>There are no open issues</p> :
                    <>
                        <div className="float-right">
                            <Form.Select onChange={(e) => {
                                fetchIssues(e.target.value);
                            }}>
                                <option value={1}>Time: Newest</option>
                                <option value={2}>Time: Oldest</option>
                                <option value={3}>Priority: Ascending</option>
                                <option value={4}>Priority: Descending</option>
                            </Form.Select>
                        </div>
                        <br/>
                        <br/>
                        <Row xs={1} md={2} className="card-deck">
                            {issues.map((issue, keyID) => (
                                <Col key={keyID}>
                                    <Card className="mb-2">
                                        <Card.Header><b>{issue.title}</b></Card.Header>
                                        <Card.Body>
                                            <Form>
                                                <Card.Text>
                                                    <b>Description:</b> {issue.content}
                                                    <br/>
                                                    <b>Priority:</b> {priorities[issue.priority]}
                                                    <br/>
                                                    <br/>
                                                    <FormSelect
                                                        onChange={(e) => {
                                                            setPriority(e.target.value)
                                                        }}
                                                    >
                                                        <option value="none" key="none" selected disabled
                                                                hidden>
                                                            Select priority
                                                        </option>
                                                        {priorities.map((priority, idx) => (
                                                            <option value={idx} key={idx}>{priority}</option>
                                                        ))}
                                                    </FormSelect>
                                                    <br/>
                                                    <Button className="float-left" onClick={() => {
                                                        editIssue(issue.issueId, true)
                                                    }}>Change Priority</Button>
                                                    <Button className="float-right" onClick={() => {
                                                        editIssue(issue.issueId)
                                                    }}>Mark as Resolved</Button>
                                                </Card.Text>
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                    <br/>
                                </Col>
                            ))}
                        </Row>
                    </>
                }
            </Container>
        </>
    );
};