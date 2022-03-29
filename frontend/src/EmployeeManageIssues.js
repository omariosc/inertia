import {Button, Card, Col, Container, Dropdown, DropdownButton, Form, FormSelect, Row} from "react-bootstrap";
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

    async function fetchIssues() {
        let request = await fetch(host + "api/admin/Issues/?closed=false", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${cookies.get('accessToken')}`
            },
            mode: "cors"
        });
        setIssues(await request.json());
    }

    async function editIssue(id, changePriority = false) {
        const requestBody = (changePriority ?
            {"priority": parseInt(priority)} :
            {"resolution": "Resolved"})
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
                            <DropdownButton className="dropdown-basic-button" title="Sort by: ">
                                <Dropdown.Item>Priority: Ascending</Dropdown.Item>
                                <Dropdown.Item>Priority: Descending</Dropdown.Item>
                                <Dropdown.Item>Time: First</Dropdown.Item>
                                <Dropdown.Item>Time: Last</Dropdown.Item>
                            </DropdownButton>
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