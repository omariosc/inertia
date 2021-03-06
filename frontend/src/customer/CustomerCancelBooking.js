/* Purpose of file: Allow a customer to cancel an existing booking of theirs */

import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button, Container, Table} from 'react-bootstrap';
import {NotificationManager} from 'react-notifications';
import host from '../host';
import showDate from '../showDate';
import orderState from '../staff/orderState';
import {useAccount} from '../authorize';

/**
 * Renders the customer cancel booking page
 * @return {JSX.Element} Customer cancel booking page
 */
export default function CustomerCancelBooking() {
  const [account] = useAccount();
  const navigate = useNavigate();
  const {orderId} = useParams();
  const [booking, setBooking] = useState('');

  useEffect(() => {
    fetchOrderInfo();
  }, []);

  /**
   * Gets the details of the chosen order
   */
  async function fetchOrderInfo() {
    try {
      const request = await fetch(host + `api/Orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        mode: 'cors',
      });
      const response = await request;
      if (response.status === 422) {
        NotificationManager.error(
            'Cannot create extension from invalid booking ID.', 'Error');
        navigate('../');
      } else if (response.status === 200) {
        setBooking(await response.json());
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Cancels the chosen order and updates the backend server
   */
  async function cancelBooking() {
    try {
      const request = await fetch(host + `api/Orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        mode: 'cors',
      });
      const response = await request;
      if (response.status === 422) {
        NotificationManager.error('Unable to cancel booking', 'Error');
      } else if (response.status === 200) {
        NotificationManager.success('Booking Cancelled.', 'Success');
        navigate('/current-bookings');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Container>
      {(booking === '') ?
            <p>Select a booking to show booking details.</p> :
            <>
              <Table className="table-formatting">
                <tbody>
                  <tr>
                    <td><b>Booking ID:</b></td>
                    <td>{booking.orderId}</td>
                  </tr>
                  {(booking.scooter) ?
                    <tr>
                      <td><b>Scooter ID:</b></td>
                      <td>{booking.scooter.softScooterId}</td>
                    </tr> :
                    <tr>
                      <td><b>Scooter:</b></td>
                      <td>{booking.scooterId}</td>
                    </tr>
                  }
                  {(booking.account) ?
                    <>
                      {(booking.account.depo) ?
                          <tr>
                            <td><b>Depot:</b></td>
                            <td>{booking.account.depo.name}</td>
                          </tr> : null
                      }
                    </> :
                    null
                  }
                  <tr>
                    <td><b>Cost:</b></td>
                    <td>??{booking.cost.toFixed(2)}</td>
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
            </>
      }


      <Button className="float-right" variant="danger"
        onClick={cancelBooking}>Cancel Booking</Button>


    </Container>
  );
};
