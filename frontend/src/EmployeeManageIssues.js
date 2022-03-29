import {Button, Card, Col, Container, Form, FormSelect, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import React, {useEffect, useState} from "react";
import host from "./host";
import Cookies from "universal-cookie";

export default function ManageIssues() {
    const cookies = new Cookies();
    const [issues, setIssues] = useState('');
    const [priority, setPriority] = useState('');
    const priorities = ["None", "Low", "Medium", "High"];

    useEffect(() => {
        fetchIssues()
    }, []);

    async function fetchIssues(sort = null) {
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
        switch (sort) {
            case '1':
                response.sort((a, b) => b.issueId - a.issueId);
                break;
            case '2':
                response.sort((a, b) => a.issueId - b.issueId);
                break;
            case '3':
                response.sort((a, b) => a.priority - b.priority);
                break;
            case '4':
                response.sort((a, b) => b.priority - a.priority);
                break;
            default:
                break;
        }
        setIssues(response);
    }

    async function editIssue(id, changePriority = false) {
        const requestBody = (changePriority ?
            {"priority": parseInt(priority)} :
            {"resolution": "Resolved"})
        if (changePriority === true && (priority === '' || priority === 'none')) {
            alert("You must select a priority.");
            return;
        }
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
    }

    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Manage Issues</h1>
            <br/>
            <Container>
                {(issues.length === 0) ?
                    <h6>There are no open issues</h6> :
                    <>
                        <div style={{float: "right"}}>
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
                        <div className="scroll" style={{maxHeight: "40rem", overflowX: "hidden"}}>
                            <Row xs={1} md={2} className="card-deck">
                                {issues.map((issue, keyidx) => (
                                    <Col key={keyidx}>
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
                                                            <option value="none" key="none">Select priority...
                                                            </option>
                                                            {priorities.map((priority, idx) => (
                                                                <option value={idx} key={idx}>{priority}</option>
                                                            ))}
                                                        </FormSelect>
                                                        <br/>
                                                        <Button style={{float: "left"}}
                                                                onClick={() => {
                                                                    editIssue(issue.issueId, true)
                                                                }}>Change Priority</Button>
                                                        <Button style={{float: "right"}}
                                                                onClick={() => {
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
                        </div>
                    </>
                }
            </Container>
        </>
    );
};