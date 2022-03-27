import React, {useState} from "react";
import {Button, Form, Container, Col, Row} from "react-bootstrap";
import './StaffInterface.css';
import host from './host';
import validate from './Validators';
import Cookies from "universal-cookie";

export default function AccountManagement() {
    const cookies = new Cookies();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function onSubmit() {
        if (!validate(name, email, password, confirmPassword)) {
            return;
        }
        let accountId;
        try {
            let signupRequest = await fetch(host + 'api/Users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    'name': name,
                    'email': email,
                    'password': password
                }),
                mode: "cors"
            });
            let signupResponse = await signupRequest;
            console.log(signupResponse)
            let getRequest = await fetch(host + 'api/admin/Users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                mode: "cors"
            });
            let getResponse = await getRequest.json();
            for (let i = 0; getResponse.length; i++) {
                let account = getResponse[i];
                if (account.email === email) {
                    accountId = account.accountId;
                    break;
                }
            }
            let patchRequest = await fetch(host + `api/admin/Users/${accountId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    'accountRole': 1
                }),
                mode: "cors"
            });
            let patchResponse = await patchRequest;
            if (patchResponse.status === 200) {
                alert(`Success! Created employee account for ${name}`)
            } else {
                alert(patchResponse.description)
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <h1 style={{paddingLeft: '10px'}}>Account Management</h1>
            <br/>
            <Container>
                <Row>
                    <Col xs={4}/>
                    <Col xs={4}>
                        <Form>
                            <Form.Group>
                                <Form.Label><b>Employee Name</b></Form.Label>
                                <Form.Control type="name" onInput={e => setName(e.target.value)}
                                              placeholder="Enter employee name" required as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Employee Email</b></Form.Label>
                                <Form.Control type="email" onInput={e => setEmail(e.target.value)}
                                              placeholder="Enter employee email" required as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Employee Password</b></Form.Label>
                                <Form.Control type="password" onInput={e => setPassword(e.target.value)}
                                              placeholder="Enter employee password" required
                                              as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Form.Label><b>Confirm Employee Password</b></Form.Label>
                                <Form.Control type="password" onInput={e => setConfirmPassword(e.target.value)}
                                              placeholder="Confirm employee password" required
                                              as="input"/>
                            </Form.Group>
                            <br/>
                            <Form.Group>
                                <Button variant="primary" onClick={onSubmit} style={{float: 'right'}}>Create Employee
                                    Account</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}