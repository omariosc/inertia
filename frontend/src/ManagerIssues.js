import React, {useEffect, useState} from "react";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import host from './host';
import Cookies from 'universal-cookie';
import './StaffInterface.css';

export default function Issues() {
    const cookies = new Cookies();
    const [issues, setIssues] = useState('');

    useEffect(() => {
        fetchIssues()
    }, []);

    async function fetchIssues() {
        let request = await fetch(host + "api/admin/Issues/?closed=false&priority=3", {
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

    async function resolveIssue(id) {
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
    }

    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>High Priority Issues</h1>
            <br/>
            <Container>
                {(issues === '') ?
                    <h6>Loading...</h6> :
                    <>
                        {(issues.length === 0) ?
                            <h6>There are no high priority issues</h6> :
                            <div className="scroll" style={{maxHeight: "40rem", overflowX: "hidden"}}>
                                <Row xs={1} md={2} className="card-deck">
                                    {issues.map((issue, idx) => (
                                        <Col key={idx}>
                                            <Card className="g-2" >
                                                <Card.Header><b>{issue.title}</b></Card.Header>
                                                <Card.Body>
                                                    <Card.Text>
                                                        <b>Description:</b> {issue.content}
                                                        <br/>
                                                        <b>Priority:</b> High
                                                    </Card.Text>
                                                    <Button style={{float: "right"}} onClick={() => resolveIssue(issue.issueId)}>Mark as
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