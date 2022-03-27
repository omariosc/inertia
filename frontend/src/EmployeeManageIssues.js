import {Button, Card, Col, Container, Dropdown, DropdownButton, Form, FormSelect, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import host from "./host";
import Cookies from "universal-cookie";

export default function ManageIssues() {
    const cookies = new Cookies();
    const [issues, setIssues] = useState('');
    const [priority, setPriority] = useState('');
    const priorities = ["None", "Low", "Medium", "High"];
    const sort_filters = ["Priority: Ascending", "Priority: Descending", "Time: First", "Time: Last"];

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
                                {sort_filters.map((filter, idx) => (
                                    <Dropdown.Item key={idx}>{filter}</Dropdown.Item>
                                ))}
                            </DropdownButton>
                        </div>
                        <br/>
                        <br/>
                        <div className="scroll" style={{maxHeight: "40rem", overflowX: "hidden"}}>
                            <Row xs={1} md={2} className="card-deck">
                                {issues.map((issue, idx) => (
                                    <Col>
                                        <Card
                                            bg="light"
                                            key={idx}
                                            text="dark"
                                            className="mb-2"
                                        >
                                            <Card.Header><b>{issue.title}</b></Card.Header>
                                            <Card.Body>
                                                <Card.Text><b>Description:</b> {issue.content}</Card.Text>
                                                <Card.Text><b>Priority:</b> High</Card.Text>
                                                <Card.Text>
                                                    <Form>
                                                        <Form.Group>
                                                            <Card.Text><b>Priority:</b> {priorities[issue.priority]}
                                                            </Card.Text>
                                                            <FormSelect
                                                                defaultValue="Select priority..."
                                                                onChange={(e) => {
                                                                    setPriority(e.target.value)
                                                                }}
                                                            >
                                                                <option value="none">Select priority...
                                                                </option>
                                                                {priorities.map((priority, idx) => (
                                                                    <option key={idx} value={idx}>{priority}</option>
                                                                ))}
                                                            </FormSelect>
                                                        </Form.Group>
                                                        <br/>
                                                        <Form.Group>
                                                            <Button variant="primary" style={{float: "left"}}
                                                                    onClick={() => editIssue(issue.issueId, true)}>Change
                                                                Priority
                                                            </Button>
                                                            <Button variant="primary" style={{float: "right"}}
                                                                    onClick={() => editIssue(issue.issueId)}>Mark as
                                                                Resolved
                                                            </Button>
                                                        </Form.Group>
                                                    </Form>
                                                </Card.Text>
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
}