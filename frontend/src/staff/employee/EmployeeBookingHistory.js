/*
* Purpose of file: Display all bookings in a table and show
* extra information when a specific booking is selected
*/

import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Col, Container, Row, Table} from 'react-bootstrap';
import {useAccount} from '../../authorize';
import host from '../../host';

/**
 * Renders the employee booking history page, shows a list of
 * all previous bookings
 * @return {JSX.Element} Employee booking history page
 */
export default function EmployeeBookingHistory() {
  const [account] = useAccount();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  /**
   * Gets list of bookings from backend server
   */
  async function fetchBookings() {
    try {
      const request = await fetch(host + 'api/admin/Orders/', {
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
      setBookings(ongoingBookings);
    } catch (e) {
      console.log(e);
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
            navigate('/booking-history');
          }}>Booking History</a></b>
      </p>
      <h3 id="pageName">Booking History</h3>
      <hr id="underline"/>
      <Container className="responsive-table">
        {(bookings === '') ? <p>Loading bookings...</p> :
              (bookings.length === 0) ? <p>There are no bookings.</p> :
                  <Row xs={1}>
                    <Col>
                      <Table className="table-formatting">
                        <tbody>
                          {bookings.map((booking, idx) => (
                            <tr key={idx} className="minWidthFieldSmall">
                              <td>{booking['orderId']}</td>
                              <td className="float-end">
                                <Button onClick={() => navigate(
                                    '../bookings/' + booking['orderId'])}>
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
        }
      </Container>
    </>
  );
};
