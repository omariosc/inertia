import React, {useState} from "react";
import {Button, Container, Form} from "react-bootstrap";
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
        if (content.length === 0) {
            alert("Issue must have a title");
            return;
        }
        if (priority === '' || priority === 'none') {
            alert("Issue must have a priority");
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
            <h3 id={"pageName"}>Submit Issue</h3>
            <hr id="underline"/>
            <br/>
            <Container>
                <Form>
                    <div className="input issue">
                        <label>Title</label>
                        <input onInput={e => setTitle(e.target.value)}/>
                    </div>
                    <div className="input issue">
                        <label>Priority</label>
                        <select
                            onChange={(e) => {
                                setPriority(e.target.value)
                            }}
                        >
                            <option value="none"/>
                            {["None", "Low", "Medium", "High"].map((priority, idx) => (
                                <option value={idx}>{priority}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input issue align-self-start">
                        <label>Description</label>
                        <textarea rows={8} onInput={e => setContent(e.target.value)}/>
                    </div>
                    <Form.Group style={{paddingTop: "20px"}}>
                        <Button onClick={submitIssue}>Create Issue</Button>
                    </Form.Group>
                </Form>
            </Container>
        </>
    );
};