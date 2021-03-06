/*
* Purpose of file: Display pending bookings to a staff member
* and allow them to approve or deny them
*/

import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Container, Table} from 'react-bootstrap';
import {NotificationManager} from 'react-notifications';
import {useAccount} from '../../authorize';
import showDate from '../../showDate';
import host from '../../host';

/**
 * Renders employee booking application page, shows a list of
 * bookings made by unregistered users
 * @return {JSX.Element} Employee booking application page
 */
export default function EmployeeBookingApplications() {
  const [account] = useAccount();
  const [bookingHistory, setBookingHistory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  /**
   * Gets list of unregistered users' bookings from backend server
   */
  async function fetchBookings() {
    try {
      const request = await fetch(host + `api/admin/Orders/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        mode: 'cors',
      });
      const allBookings = await request.json();
      const ongoingBookings = [];
      for (let i = 0; i < allBookings.length; i++) {
        if (allBookings[i].orderState === 1) {
          if (allBookings[i]['extensions'].length > 0) {
            // eslint-disable-next-line max-len
            allBookings[i].endTime = allBookings[i]['extensions'][allBookings[i]['extensions'].length -
            1].endTime;
            // eslint-disable-next-line guard-for-in
            for (let j = 0; j < allBookings[i]['extensions'].length; j++) {
              allBookings[i].cost += allBookings[i]['extensions'][j].cost;
            }
          }
          ongoingBookings.push(allBookings[i]);
        }
      }
      setBookingHistory(ongoingBookings);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Approves the booking associated with the provided ID and updates the
   * backend server
   * @param {number} id ID of the booking to approve
   */
  async function approveBooking(id) {
    try {
      const request = await fetch(host + `api/admin/Orders/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        mode: 'cors',
      });
      const response = await request;
      if (response.status !== 200) {
        NotificationManager.error('Could not approve booking.', 'Error');
      } else {
        NotificationManager.success('Approved booking.', 'Success');
      }
    } catch (e) {
      console.log(e);
    }
    await fetchBookings();
  }

  /**
   * Denies the booking associated with the provided ID and updates
   * the backend server
   * @param {number} id ID of the booking to deny
   */
  async function denyBooking(id) {
    try {
      const request = await fetch(host + `api/admin/Orders/${id}/deny`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        mode: 'cors',
      });
      const response = await request;
      if (response.status !== 200) {
        NotificationManager.error('Could not deny booking.', 'Error');
      } else {
        NotificationManager.success('Denied booking.', 'Success');
      }
    } catch (e) {
      console.log(e);
    }
    await fetchBookings();
  }

  return (
    <>
      <p id="breadcrumb">
        <a className="breadcrumb-list" onClick={() => {
          navigate('/home');
        }}>Home
        </a> &gt; <a className="breadcrumb-list" onClick={() => {
          navigate('/bookings');
        }}>Bookings</a> &gt; <b>
          <a className="breadcrumb-current" onClick={() => {
            navigate('/booking-applications');
          }}>Booking Applications</a></b>
      </p>
      <h3 id="pageName">Booking Applications</h3>
      <hr id="underline"/>
      <Container className="responsive-table">
        {(bookingHistory === '') ?
              <p>Loading booking applications...</p> :
              <>
                {(bookingHistory.length === 0) ?
                    <p>There are no booking applications.</p> :
                    <>
                      <Table className="table-formatting">
                        <thead>
                          <tr>
                            <th className="minWidthFieldSmall">Customer ID</th>
                            <th className="minWidthFieldSmall">Scooter ID</th>
                            <th className="minWidthFieldSmall">
                            Time Expiring
                            </th>
                            <th>Approve</th>
                            <th>Deny</th>
                            <th>Booking Confirmation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(bookingHistory === '') ?
                            <p>Loading bookings...</p> :
                            <>
                              {bookingHistory.map((booking, idx) => (
                                <tr key={idx}>
                                  <td>{booking.accountId}</td>
                                  <td>{booking.scooterId}</td>
                                  <td>{showDate(booking.endTime)}</td>
                                  <td>
                                    <Button onClick={() => approveBooking(
                                        booking['orderId'])}
                                    variant="success">Approve</Button>
                                  </td>
                                  <td>
                                    <Button onClick={() => denyBooking(
                                        booking['orderId'])}
                                    variant="danger">Deny</Button>
                                  </td>
                                  <td>
                                    <Button
                                      onClick={() => navigate(
                                          '../bookings/' +
                                              booking['orderId'])}>
                                        View
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </>
                          }
                        </tbody>
                      </Table>
                    </>
                }
              </>
        }
      </Container>
    </>
  );
};
