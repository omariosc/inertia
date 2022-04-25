import React, {useState} from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import host from "../../host";
import Cookies from "universal-cookie";

export default function EmployeeSubmitIssue() {
    const cookies = new Cookies();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('');

    async function submitIssue() {
        if (title.length === 0) {
            alert("Issue must have a title");
            return;
        }
        if (priority === '' || priority === 'none') {
            alert("Issue must have a priority");
            return;
        }
        if (content.length === 0) {
            alert("Issue must have a description");
            return;
        }
        try {
            await fetch(host + `api/Users/${cookies.get("accountID")}/issues`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    "priority": parseInt(priority),
                    "title": title.toString(),
                    "content": content.toString()
                }),
                mode: "cors"
            });
            alert("Created issue.");
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/dashboard">Home
                </a> > <a className="breadcrumb-list" href="/submit-issue">Issues</a> > <b>
                <a className="breadcrumb-current" href="/submit-issue">Submit Issue</a></b>
            </p>
            <h3 id="pageName">Submit Issue</h3>
            <hr id="underline"/>
            <br/>
            <Container>
                <Row className="input issue">
                    <Col xs={1}>
                        <label>Title</label>
                    </Col>
                    <Col xs={1}/>
                    <Col xs="auto">
                        <input onInput={e => setTitle(e.target.value)}/>
                    </Col>
                </Row>
                <Row className="input issue">
                    <Col xs={1}>
                        <label>Priority</label>
                    </Col>
                    <Col xs={1}/>
                    <Col xs="auto">
                        <select onChange={(e) => {
                            setPriority(e.target.value)
                        }}>
                            <option value="none" key="none" selected disabled hidden>Select priority</option>
                            {["None", "Low", "Medium", "High"].map((priority, idx) => (
                                <option value={idx}>{priority}</option>
                            ))}
                        </select>
                    </Col>
                </Row>
                <Row className="input issue">
                    <Col xs={1}>
                        <label>Description</label>
                    </Col>
                    <Col xs={1}/>
                    <Col xs="auto">
                        <textarea rows={8} onInput={e => setContent(e.target.value)}/>
                    </Col>
                </Row>
                <div className="large-padding-top">
                    <Button onClick={submitIssue}>Create Issue</Button>
                </div>
            </Container>
        </>
    );
};