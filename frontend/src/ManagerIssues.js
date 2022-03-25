import React, {useEffect, useState} from "react";
import {Button, Card, Container} from "react-bootstrap";
import './StaffInterface.css'
import host from './host';
import Cookies from 'universal-cookie';

function Issues() {
    const cookies = new Cookies();
    const [issues, setIssues] = useState('');

    useEffect(() => {
        fetchIssues()
    }, []);

    async function fetchIssues() {
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
            setIssues(await request.json());
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>High Priority Issues</h1>
            <br/>
            <Container>
                <div className="scroll">
                    {(issues === '') ?
                        <h6>Loading...</h6> :
                        <>
                            {(issues.length === 0) ?
                                <h6>There are no high priority issues</h6> :
                                <>
                                    {issues.map((issue, idx) => (
                                        <Card
                                            bg="light"
                                            key={idx}
                                            text="dark"
                                            className="mb-2"
                                        >
                                            <Card.Body>
                                                <Card.Text><b>Issue {idx + 1}:</b> {issue}</Card.Text>
                                                <Card.Text><b>Reported by:</b> {issue}</Card.Text>
                                                <Card.Text><b>Priority:</b> High</Card.Text>
                                                <Button variant="primary">Mark as Resolved</Button>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </>
                            }
                        </>
                    }
                </div>
            </Container>
        </>
    );
}

export default Issues;