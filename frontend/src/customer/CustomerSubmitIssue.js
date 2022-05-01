/*
	Purpose of file: Allow a customer to submit a new issue
*/

import React, {useState} from "react";
import {Button, Form} from "react-bootstrap";
import {NotificationManager} from "react-notifications";
import host from "../host";
import {useAccount} from "../authorize";

/**
 * Renders the customer submit issue page, allows them to
 * raise a new issue
 * @returns Customer submit issue page
 */
export default function CustomerSubmitIssue() {
    const [account] = useAccount();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [validTitle, setValidTitle] = useState(true);
    const [validDescription, setValidDescription] = useState(true);

		/**
		 * Send the customer's new issue to the backend server
		 */
    async function submitIssue() {
        setValidTitle(title.length > 0);
        setValidDescription(content.length > 0);
        if (title.length === 0 || content.length === 0) {
            return;
        }
        try {
            await fetch(host + `api/Users/${account.id}/issues`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${account.accessToken}`
                },
                body: JSON.stringify({
                    "title": title.toString(),
                    "content": content.toString()
                }),
                mode: "cors"
            });
            NotificationManager.success("Created issue.", "Success");
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label><h5>Enter Issue Title</h5></Form.Label>
                <Form.Control autoFocus type="text" placeholder="Enter issue title here..."
                              isInvalid={!validTitle} onInput={e => setTitle(e.target.value)}/>
                <Form.Control.Feedback type="invalid">
                    Please enter issue title
                </Form.Control.Feedback>
            </Form.Group>
            <br/>
            <Form.Group className="mb-3">
                <Form.Label><h5>Enter Issue Description</h5></Form.Label>
                <Form.Control type="text" as="textarea" rows={3} placeholder="Enter issue description here..."
                              isInvalid={!validDescription} onInput={e => setContent(e.target.value)}/>
                <Form.Control.Feedback type="invalid">
                    Please enter issue description
                </Form.Control.Feedback>
            </Form.Group>
            <br/>
            <Button onClick={submitIssue} className="float-right">Create Issue</Button>
        </Form>
    );
};