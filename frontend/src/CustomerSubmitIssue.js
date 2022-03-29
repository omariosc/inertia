import React, {useState} from "react";
import {Button, Form} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import host from "./host";
import Cookies from "universal-cookie";

export default function SubmitIssue() {
    const cookies = new Cookies();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    async function submitIssue() {
        if (title.length === 0) {
            alert("Issue must have a title");
            return;
        }
        if (content.length === 0) {
            alert("Issue must have a title");
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
        <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label><h6>Enter Issue Title</h6></Form.Label>
                <Form.Control placeholder="Enter issue title here..."
                              onInput={e => setTitle(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label><h6>Enter Issue Description</h6></Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter issue description here..."
                              onInput={e => setContent(e.target.value)}/>
            </Form.Group>
            <br/>
            <Form.Group>
                <Button onClick={submitIssue} style={{float: "right"}}>Create Issue</Button>
            </Form.Group>
        </Form>
    );
}