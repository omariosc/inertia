/* Purpose of file: Display a customer's account settings and information
and allow them to change their password. */

import React, {useEffect, useState} from 'react';
import {Button, Form, Table} from 'react-bootstrap';
import changePassword from '../ChangePassword';
import host from '../host';
import {useAccount} from '../authorize';

/**
 * Renders the customer settings page, allows them to change
 * their password
 * @return {JSX.Element} Customer settings page
 */
export default function CustomerSettings() {
  const [account] = useAccount();
  const [accountInfo, setAccountInfo] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchAccountInformation();
  }, []);

  /**
   * Gets the customer's account information from the backend server
   */
  async function fetchAccountInformation() {
    try {
      const request = await fetch(host + `api/Users/${account.id}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        mode: 'cors',
      });
      setAccountInfo(await request.json());
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * If the customer changes their password, submit a request
   * to the backend server to change it
   */
  async function onSubmit() {
    await changePassword(oldPassword, password, confirmPassword, account);
  }

  return (
    <>
      <h5>Account Information</h5>
      {(accountInfo === '') ?
            <p>Loading account information...</p> :
            <Table>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>{accountInfo.name}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{accountInfo.email}</td>
                </tr>
              </tbody>
            </Table>
      }
      <h5 className="small-padding-top">Change Password</h5>
      <br/>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Old Password</Form.Label>
          <Form.Control autoFocus placeholder="Enter old password..."
            type="password"
            onInput={(e) => setOldPassword(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control type="password" placeholder="Enter new password..."
            onInput={(e) => setPassword(e.target.value)}/>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" placeholder="Confirm new password..."
            onInput={(e) => setConfirmPassword(e.target.value)}/>
        </Form.Group>
        <Button className="float-right" onClick={onSubmit}>Change
            password</Button>
      </Form>
    </>
  );
};
