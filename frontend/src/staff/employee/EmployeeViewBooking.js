/* Purpose of file: Display a detailed view of a booking */

import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Container, Table} from 'react-bootstrap';
import {NotificationManager} from 'react-notifications';
import {useAccount} from '../../authorize';
import showDate from '../../showDate';
import host from '../../host';
import orderState from '../orderState';

/**
 * Renders more detailed information on a specific booking
 * @return {JSX.Element} Detailed booking view
 */
export default function staffViewBooking() {
  const navigate = useNavigate();
  const {orderId} = useParams();
  const [account] = useAccount();
  const [booking, setBooking] = useState('');

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  /**
   * Gets the information about the booking from the backend server
   */
  async function fetchBookingDetails() {
    try {
      const request = await fetch(host + `api/admin/Orders/` + orderId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        mode: 'cors',
      });

      const response = await request.json();
      if (response.errorCode) {
        NotificationManager.error('Invalid Booking ID.', 'Error');
        navigate('/bookings');
      } else {
        if (response['extensions'].length > 0) {
          // eslint-disable-next-line max-len
          response.endTime = response['extensions'][response['extensions'].length -
          1].endTime;
          for (let i = 0; i < response['extensions'].length; i++) {
            response.cost += response['extensions'][i].cost;
          }
        }
        setBooking(response);
      }
    } catch (error) {
      NotificationManager.error('Could not load booking.', 'Error');
      navigate('/bookings');
      console.error(error);
    }
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
            navigate(`/bookings/${orderId}`);
          }}>#{orderId}</a></b>
      </p>
      <br className="booking-responsive-mobile"/>
      {(booking === '') ? <p>Loading booking details...</p> :
            <Container>
              <Table>
                <tbody>
                  <tr>
                    <td><b>Booking ID:</b></td>
                    <td>{booking.orderId}</td>
                  </tr>
                  {(booking.scooter) ?
                    <>
                      <tr>
                        <td><b>Scooter ID:</b></td>
                        <td>{booking.scooter.softScooterId}</td>
                      </tr>
                      {(booking.scooter.depo) ?
                          <tr>
                            <td><b>Depot:</b></td>
                            <td>{booking.scooter.depo.name}</td>
                          </tr> : null
                      }
                    </> :
                    <tr>
                      <td><b>Scooter:</b></td>
                      <td>{booking.scooterId}</td>
                    </tr>
                  }
                  {(booking.accountId) ?
                    <tr>
                      <td><b>Customer ID:</b></td>
                      <td>{booking.accountId}</td>
                    </tr> : null
                  }
                  {(booking.account) ?
                    <>
                      {(booking.account.name) ?
                          <tr>
                            <td><b>Customer Name:</b></td>
                            <td>{booking.account.name}</td>
                          </tr> :
                          null
                      }
                    </> :
                    null
                  }
                  <tr>
                    <td><b>Cost:</b></td>
                    <td>£{booking.cost.toFixed(2)}</td>
                  </tr>
                  {(booking.discount > 0) ?
                    <tr>
                      <td><b>Discount:</b></td>
                      <td>{booking.discount * 100}%</td>
                    </tr> : null
                  }
                  <tr>
                    <td><b>Created At:</b></td>
                    <td>{showDate(booking.createdAt)}</td>
                  </tr>
                  <tr>
                    <td><b>Start Time:</b></td>
                    <td>{showDate(booking.startTime)}</td>
                  </tr>
                  <tr>
                    <td><b>End Time:</b></td>
                    <td>{showDate(booking.endTime)}</td>
                  </tr>
                  <tr>
                    <td><b>Order Status:</b></td>
                    <td>{orderState[booking.orderState]}</td>
                  </tr>

                  <tr>
                    <td><b>Extensions:</b></td>
                    <td>
                      <p>{booking.hireOption.name}</p>
                      {
                        booking.extensions.map((extension) =>
                          <p key={extension}>{extension.hireOption.name}</p>,
                        )
                      }
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Container>
      }
      <Button className="float-right" variant="danger" onClick={() => {
        navigate('/bookings');
      }}>Close</Button>
    </>
  );
}
