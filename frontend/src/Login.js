/* eslint-disable react/prop-types */
/* Purpose of file: Login form used to authenticate a user,
checks type of user (customer, employee, manager) */

import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Form, Modal} from 'react-bootstrap';
import {NotificationManager} from 'react-notifications';
import {useAccount} from './authorize';

/**
 * Login form to authenticate users when they sign in
 * @param {ReactPropTypes} props
 * @return {JSX.Element} The login form
 */
export default function LoginForm(props) {
  const {scooterChoiceId, hireChoiceId, startTime} = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, , signIn] = useAccount();

  return (
    <Modal {...props} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control className="max-width" type="email"
          placeholder="Enter email address"
          onInput={(e) => setEmail(e.target.value)}/>
        <br/>
        <Form.Control className="max-width" type="password"
          placeholder="Enter password"
          onInput={(e) => setPassword(e.target.value)}/>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button className="float-left" variant="danger"
          onClick={props.onHide}>Cancel</Button>
        <Button className="float-right" onClick={() => {
          signIn(email, password, (m, account) => {
            if (m === 'login success') {
              NotificationManager.success('Logged In.', 'Success');
              if (account.role === '0') {
                if (startTime && hireChoiceId && scooterChoiceId) {
                  navigate(
                      // eslint-disable-next-line max-len
                      `../payment/${scooterChoiceId}/${hireChoiceId}/${startTime}`);
                } else {
                  navigate('/');
                }
              } else if (account.role === '1') {
                navigate('/home');
              } else if (account.role === '2') {
                navigate('/dashboard');
              }
            } else {
              NotificationManager.error('Invalid Credentials.', 'Error');
            }
          });
        }}>Login</Button>
      </Modal.Footer>
    </Modal>
  );
};
