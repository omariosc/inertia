/* Purpose of file: Allows a new user to register to the application */

import React, {useState} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import {NotificationManager} from 'react-notifications';
import validate from './Validators';
import host from './host';
import {useNavigate, useParams} from 'react-router-dom';
import {useAccount} from './authorize';

/**
 * Renders the registration form
 * @param {ReactPropTypes} props
 * @return {JSX.Element} The registration form
 */
export default function RegisterForm(props) {
  const navigate = useNavigate();
  const {scooterChoiceId, hireChoiceId, startTime} = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [, , signIn] = useAccount();

  /**
   * Attempts to create a new user account
   */
  async function onSubmit() {
    if (!validate(name, email, password, confirmPassword)) {
      return;
    }
    try {
      const request = await fetch(host + 'api/Users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          'name': name,
          'email': email,
          'password': password,
        }),
        mode: 'cors',
      });
      const response = await request;
      if (response.status === 200) {
        NotificationManager.success('Registered Account.', 'Success');
        // eslint-disable-next-line react/prop-types
        props.onHide();
        signIn(email, password, (m) => {
          if (m === 'login success') {
            NotificationManager.success('Logged In.', 'Success');
            if (startTime && hireChoiceId && scooterChoiceId) {
              navigate(
                  `../payment/${scooterChoiceId}/${hireChoiceId}/${startTime}`);
            } else {
              navigate('/');
            }
          } else {
            NotificationManager.error('Invalid Credentials.', 'Error');
          }
        });
      } else {
        NotificationManager.error('Email address already in use.', 'Error');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Modal {...props} centered>
      <Modal.Header closeButton>
        <Modal.Title>Register</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control className="max-width" type="text"
          placeholder="Enter full name"
          onInput={(e) => setName(e.target.value)}/>
        <br/>
        <Form.Control className="max-width" type="email"
          placeholder="Enter email address"
          onInput={(e) => setEmail(e.target.value)}/>
        <br/>
        <Form.Control className="max-width" type="password"
          placeholder="Enter password"
          onInput={(e) => setPassword(e.target.value)}/>
        <br/>
        <Form.Control className="max-width" type="password"
          placeholder="Confirm password"
          onInput={(e) => setConfirmPassword(e.target.value)}/>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        {/* eslint-disable-next-line react/prop-types */}
        <Button className="float-left" onClick={props.onHide} variant="danger"
        >Cancel</Button>
        <Button className="float-right" onClick={onSubmit}>Register</Button>
      </Modal.Footer>
    </Modal>
  );
};
