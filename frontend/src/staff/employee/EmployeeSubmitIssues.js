/*
	Purpose of file: Enable a staff member to submit or report
	a new issue or problem in the application
*/

import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import Cookies from "universal-cookie";
import host from "../../host";

/**
 * Displays the submit issue form which allows the employee to
 * raise a new issue
 */
export default function EmployeeSubmitIssue() {
    const cookies = new Cookies();
    let navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [validTitle, setValidTitle] = useState(true);
    const [validDescription, setValidDescription] = useState(true);
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('');

		/**
		 * Checks that the issue has valid length and priority and sends the issue
		 * to the backend server if the check is successful 
		 */
    async function submitIssue() {
        if (title.length === 0) {
            NotificationManager.error("Issue must have a title", "Error");
            return;
        }
        if (priority === '' || priority === 'none') {
            NotificationManager.error("Issue must have a priority", "Error");
            return;
        }
        if (content.length === 0) {
            NotificationManager.error("Issue must have a description", "Error");
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
            navigate('/issues');
            NotificationManager.success("Created issue.", "Success");
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <p id="breadcrumb">
                <a className="breadcrumb-list" href="/home">Home
                </a> > <a className="breadcrumb-list" href="/issues">Issues</a> > <b>
                <a className="breadcrumb-current" href="/submit-issue">Submit Issue</a></b>
            </p>
            <h3 id="pageName">Submit Issue</h3>
            <hr id="underline"/>
            <Form className="input-form">
                <Form.Group className="mb-3">
                    <Form.Label><h5>Title</h5></Form.Label>
                    <Form.Control autoFocus type="text" placeholder="Enter issue title here..."
                                  isInvalid={!validTitle} onInput={e => setTitle(e.target.value)}/>
                    <Form.Control.Feedback type="invalid">
                        Please enter issue title
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label><h5>Priority</h5></Form.Label>
                    <Form.Select defaultValue="none" onChange={(e) => {
                        setPriority(e.target.value)
                    }}>
                        <option value="none" key="none" disabled hidden>Select priority</option>
                        {["None", "Low", "Medium", "High"].map((priority, idx) => (
                            <option value={idx} key={priority}>{priority}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label><h5>Description</h5></Form.Label>
                    <Form.Control type="text" as="textarea" rows={3} placeholder="Enter issue description here..."
                                  isInvalid={!validDescription} onInput={e => setContent(e.target.value)}/>
                    <Form.Control.Feedback type="invalid">
                        Please enter issue description
                    </Form.Control.Feedback>
                </Form.Group>
                <br/>
                <Button onClick={submitIssue} className="float-right">Create Issue</Button>
            </Form>
        </>
    );
};