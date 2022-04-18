import React, {useEffect, useState} from "react";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import host from '../../host';
import Cookies from 'universal-cookie';
import '../StaffInterface.css';

export default function Issues() {
    const cookies = new Cookies();
    const [issues, setIssues] = useState('');

    useEffect(() => {
        fetchIssues();
    }, []);

    async function fetchIssues(sortOption = null) {
        try {
            let request = await fetch(host + "api/admin/Issues/?closed=false&priority=3", {
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
                '2': (a, b) => a.issueId - b.issueId
            }
            setIssues(response.sort(sortFunctions[sortOption]));
        } catch (error) {
            console.error(error);
        }
    }

    async function resolveIssue(id) {
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
            await fetchIssues();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <h1 id={"pageName"}>High Priority Issues</h1>
            <br/>
            <Container>
                {(issues === '') ?
                    <h6>Loading issues...</h6> :
                    <>
                        <div style={{float: "right"}}>
                            <Form.Select onChange={(e) => {
                                fetchIssues(e.target.value);
                            }}>
                                <option value={1}>Time: Newest</option>
                                <option value={2}>Time: Oldest</option>
                            </Form.Select>
                        </div>
                        <br/>
                        <br/>
                        {(issues.length === 0) ?
                            <h6>There are no high priority issues</h6> :
                            <div className="scroll" style={{maxHeight: "40rem", overflowX: "hidden"}}>
                                <Row xs={1} md={2} className="card-deck">
                                    {issues.map((issue, idx) => (
                                        <Col key={idx}>
                                            <Card className="g-2">
                                                <Card.Header><b>{issue.title}</b></Card.Header>
                                                <Card.Body>
                                                    <Card.Text>
                                                        <b>Description:</b> {issue.content}
                                                        <br/>
                                                        <b>Priority:</b> High
                                                    </Card.Text>
                                                    <Button style={{float: "right"}}
                                                            onClick={() => resolveIssue(issue.issueId)}>Mark as
                                                        Resolved</Button>
                                                </Card.Body>
                                            </Card>
                                            <br/>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        }
                    </>
                }
            </Container>
        </>
    );
};