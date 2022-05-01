/* Purpose of file: Display a customer's current discount status
and allow them to apply for a specific type of discount */

import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import {NotificationManager} from 'react-notifications';
import host from '../host';
import moment from 'moment';
import {useAccount} from '../authorize';

/**
 * Renders the customer discount page, shows their current discount status
 * and allows them to apply for new discounts
 * @return {JSX.Element} Customer discount page
 */
export default function CustomerDiscounts() {
  const [account] = useAccount();
  const navigate = useNavigate();
  const [loading, setLoading] = useState('');
  const [frequentUser, setFrequent] = useState(false);
  const [studentUser, setStudentStatus] = useState(false);
  const [seniorUser, setSeniorStatus] = useState(false);
  const [studentImage, setStudentImage] = useState(null);
  const [seniorImage, setSeniorImage] = useState(null);
  const [recentHours, setHours] = useState(null);

  useEffect(() => {
    fetchDiscountStatus();
  }, []);

  /**
   * Checks if a customer is eligible for frequent user discount, applies it
   * automatically and updates the backend server
   */
  async function getDiscountStatus() {
    try {
      const request = await fetch(host + `api/Users/${account.id}/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        mode: 'cors',
      });
      const response = await request.json();
      const thresholdDate = moment().subtract(1, 'week').toISOString();
      const recentBookings = response.filter(
          (e) => e.createdAt >= thresholdDate);
      let recentHours = 0;
      for (let i = 0; i < recentBookings.length; i++) {
        if (recentBookings[i].orderState !== 0 &&
            recentBookings[i].orderState !== 6) {
          recentHours += recentBookings[i].hireOption.durationInHours;
          if (recentBookings[i]['extensions'] != null) {
            for (let j = 0; j < recentBookings[i]['extensions'].length; j++) {
              // eslint-disable-next-line max-len
              recentHours += recentBookings[i]['extensions'][j].hireOption.durationInHours;
            }
          }
        }
      }
      if (recentHours >= 8) {
        setFrequent(true);
      } else {
        setHours(recentHours);
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Gets current discount status of the customer
   */
  async function fetchDiscountStatus() {
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
      const response = await request.json();
      if (response.userType === 0) {
        setStudentStatus(true);
      } else if (response.userType === 1) {
        setSeniorStatus(true);
      } else if (response.userType === 3) {
        setFrequent(true);
      } else {
        await getDiscountStatus();
      }
      setLoading('complete');
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * If the customer submits a new application, check that image is present if
   * one is required and update the backend server
   * @param {string} type Type of application made (e.g. student, senior)
   */
  async function onSubmit(type) {
    if ((type === 'student' && !studentImage) ||
        (type === 'senior' && !seniorImage)) {
      NotificationManager.error('You must upload an image.', 'Error');
      return;
    }
    try {
      const discountRequest = await fetch(
          host + `api/Users/${account.id}/ApplyDiscount`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${account.accessToken}`,
            },
            body: JSON.stringify({
              discountType: (type === 'student') ? 0 : 1,
            }),
            mode: 'cors',
          });
      const discountResponse = await discountRequest;
      if (discountResponse.status === 422) {
        NotificationManager.error('Already applied for discount.', 'Error');
        return;
      }
      const imageRequest = await fetch(
          host + `api/Users/${account.id}/ApplyDiscountUploadImage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/octet-stream',
              'Authorization': `Bearer ${account.accessToken}`,
            },
            body: (type === 'student') ? studentImage : seniorImage,
            mode: 'cors',
          });
      const imageResponse = await imageRequest;
      if (imageResponse.status === 422) {
        NotificationManager.error('Already applied for discount.', 'Error');
      } else {
        NotificationManager.success('Submitted application.', 'Success');
        navigate('/create-booking');
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      {(loading === '') ?
            <p>Loading discount status...</p> :
            <>
              {(!frequentUser && !studentUser && !seniorUser) ?
                  <>
                    <h5>Frequent User Discount</h5>
                    <>Book {(8 - parseFloat(recentHours)).toFixed(0)} hours this
                      week to enjoy our 10% frequent
                      user discount!
                    </>
                    <br/>
                    <br/>
                    <h5>Student Discount</h5>
                    <p>To apply for our 10% student discount, upload student ID
                      below.</p>
                    {window.FileReader ?
                        <>
                          {studentImage ?
                              <>
                                <p><b>Image Preview</b></p>
                                <img alt="Uploaded Student Image"
                                  src={URL.createObjectURL(studentImage)}
                                  height="300px"/>
                                <br/>
                                <br/>
                              </> :
                              null}
                          <input type="file" accept="image/*"
                            onChange={(event) => {
                              setStudentImage(event.target.files[0]);
                            }}
                          />
                          <Button className="float-right"
                            onClick={() => onSubmit(
                                'student')}>Submit</Button>
                        </> :
                        <p>Your browser does not support file reader. Use
                          another browser to upload
                          image.</p>
                    }
                    <br/>
                    <br/>
                    <h5>Senior Discount</h5>
                    <p>To apply for our 10% senior discount, upload ID showing
                      senior status below.</p>
                    {window.FileReader ?
                        <>
                          {seniorImage ?
                              <>
                                <p><b>Image Preview</b></p>
                                <img alt="Uploaded Senior Image"
                                  src={URL.createObjectURL(seniorImage)}
                                  height="300px"/>
                                <br/>
                                <br/>
                              </> :
                              null}
                          <input type="file" accept="image/*"
                            onChange={(event) => {
                              setSeniorImage(event.target.files[0]);
                            }}
                          />
                          <Button className="float-right"
                            onClick={() => onSubmit(
                                'senior')}>Submit</Button>
                        </> :
                        <p>Your browser does not support file reader. Use
                          another browser to upload
                          image.</p>
                    }
                  </> :
                  <>
                    {frequentUser ?
                        <>
                          <h5>Frequent User Discount</h5>
                          <p>Well Done! You are a frequent user. Enjoy our 10%
                            frequent user discount!</p>
                        </> : studentUser ?
                            <>
                              <h5>Student Discount</h5>
                              <p>10% student discount applied.</p>
                            </> : seniorUser ?
                                <>
                                  <h5>Senior Discount</h5>
                                  <p>10% student discount applied.</p>
                                </> : null
                    }
                  </>
              }
            </>
      }
    </>
  );
};
