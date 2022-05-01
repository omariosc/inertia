/* Purpose of file: Enables the manager account to create
new employee accounts provided the details are valid */

import React, {useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import {NotificationManager} from 'react-notifications';
import {useAccount} from '../../authorize';
import validate from '../../Validators';
import host from '../../host';
import {useNavigate} from 'react-router-dom';

/**
 * Renders the manager account management page, a form allowing
 * the manager to create a new employee account
 * @return {JSX.Element} Manager account management page
 */
export default function ManagerAccountManagement() {
  const navigate = useNavigate();
  const [account] = useAccount();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /**
   * Upon submitting the form, sends the new account details to the
   * backend server and creates a new employee account if details are valid
   */
  async function onSubmit() {
    if (!validate(name, email, password, confirmPassword)) {
      return;
    }
    try {
      const signupRequest = await fetch(host + 'api/Users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        body: JSON.stringify({
          'name': name,
          'email': email,
          'password': password,
        }),
        mode: 'cors',
      });
      const signupResponse = await signupRequest;
      if (signupResponse.status === 422) {
        NotificationManager.error('Email address already exists.', 'Error');
        return;
      }
      const getRequest = await fetch(host + 'api/admin/Users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        mode: 'cors',
      });
      const getResponse = await getRequest.json();
      let accountId;
      for (let i = 0; getResponse.length; i++) {
        const user = getResponse[i];
        if (user.email === email) {
          accountId = user.accountId;
          break;
        }
      }
      if (!accountId) {
        NotificationManager.error('Could not patch account to employee role.',
            'Error');
        return;
      }
      const patchRequest = await fetch(host + `api/admin/Users/${accountId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        body: JSON.stringify({
          'accountRole': 1,
        }),
        mode: 'cors',
      });
      const patchResponse = await patchRequest;
      if (patchResponse.status === 200) {
        NotificationManager.success(`Created employee account for ${name}.`,
            'Success');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        NotificationManager.error(patchResponse.description, 'Error');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <p id="breadcrumb">
        <a className="breadcrumb-list" onClick={() => {
          navigate('/dashboard');
        }}>Home </a> &gt; <b>
          <a className="breadcrumb-current" onClick={() => {
            navigate('/account-management');
          }}>Account Management</a></b>
      </p>
      <h3 id="pageName">Create Employee Account</h3>
      <hr id="underline"/>
      <Form className="input-form">
        <Form.Group className="mb-3">
          <Form.Label><h6>Employee Name</h6></Form.Label>
          <Form.Control autoFocus type="name" value={name}
            onInput={(e) => setName(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label><h6>Employee Email</h6></Form.Label>
          <Form.Control type="email" value={email}
            onInput={(e) => setEmail(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label><h6>Employee Password</h6></Form.Label>
          <Form.Control type="password" value={password}
            onInput={(e) => setPassword(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label><h6>Confirm Employee Password</h6></Form.Label>
          <Form.Control type="password" value={confirmPassword}
            onInput={(e) => setConfirmPassword(e.target.value)}/>
        </Form.Group>
        <Button className="float-right" onClick={onSubmit}>Create Employee
            Account</Button>
      </Form>
    </>
  );
};
