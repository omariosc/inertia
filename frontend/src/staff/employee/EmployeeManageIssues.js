import React, {useEffect, useState} from "react";
import {Col, Container, Form, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import priorities from "../priorities";
import host from "../../host";
import Cookies from "universal-cookie";

export default function EmployeeManageIssues() {
    const cookies = new Cookies();
    const [issues, setIssues] = useState('');

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

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home</a> > <b>
                <a className="breadcrumb-current" href="/issues">Issues</a></b>
            </p>
            <Container>
                {(issues.length === 0) ? <p>There are no open issues.</p> :
                    <>
                        <div>
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
                        </div>
                        <br/>
                        <br/>
                        <br/>
                        {issues.map((issue, idx) => (
                            <a key={idx} className="breadcrumb-current" href={`issues/${issue.issueId}`}>
                                <Row>
                                    <Col xs={3}>
                                        <b>{issue.title}</b>
                                    </Col>
                                    <Col xs={6} xg={7} xl={8}/>
                                    <Col className={`issue-label-${issue.priority}`}>
                                        <b className="issue-text">{priorities[issue.priority]}</b>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        created by [{(issue.account.role === 1) ? "Customer" : "Employee"}] {
                                        issue.account.name} · {
                                        parseInt((new Date(Date.now()).getTime() - new Date(issue.dateOpened).getTime()) / 86400000)
                                    } days ago
                                    </Col>
                                </Row>
                                <hr/>
                            </a>
                        ))}
                        <br/>
                    </>
                }
            </Container>
        </>
    );
};