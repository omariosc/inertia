/* Purpose of file: Display a dashboard with gerneral information
about the current state of the application */

import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card, Col, Container, Row} from 'react-bootstrap';
import host from '../host';
import {useAccount} from '../authorize';

/**
 * Renders the staff dashboard
 * @return {JSX.Element} The staff dashboard, provides summary statistics
 */
export default function Dashboard() {
  const [account] = useAccount();
  const navigate = useNavigate();
  const [data, setData] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  /**
   * Fetches dashboard statistics
   */
  async function fetchDashboard() {
    try {
      const request = await fetch(host + 'api/admin/Dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        mode: 'cors',
      });
      const responseJson = await request.json();
      if (account.role === '2') {
        setData({
          'Employees logged in': responseJson.employeesLoggedIn,
          'Users logged in': responseJson.usersLoggedIn,
          'High priority issues': responseJson.highPriorityIssues,
          'Revenue today': '£' + responseJson.revenueToday.toString(),
          'Scooters in use': responseJson.scootersInUse,
        });
      } else if (account.role === '1') {
        setData({
          'Scooters in use': responseJson.scootersInUse,
          // eslint-disable-next-line max-len
          'Scooters unavailable by Staff': responseJson.scootersUnavailableByStaff,
          'Scooters pending return': responseJson.scootersPendingReturn,
          'High priority issues': responseJson.highPriorityIssues,
          'Medium priority issues': responseJson.mediumPriorityIssues,
          'Low priority issues': responseJson.lowPriorityIssues,
          'Unassigned issues': responseJson.unassignedPriorityIssues,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <p id="breadcrumb">
        <a className="breadcrumb-list" onClick={() => {
            account.role === '2' ? navigate('/dashboard') : navigate('/home');
        }}>Home</a> &gt; <b>
          <a className="breadcrumb-current" onClick={() => {
            account.role === '2' ? navigate('/dashboard') : navigate('/home');
          }}>Dashboard</a></b>
      </p>
      <h3 id="pageName">Dashboard</h3>
      <hr id="underline"/>
      <Container>
        {(data === '') ? <p>Loading...</p> :
              <Row>
                {Object.keys(data).map((key, idx) => (
                  <Col lg={4} key={idx}>
                    <Card className="mb-4">
                      <Card.Body>
                        <Card.Text
                          className="dashboard-title">{key}</Card.Text>
                        <Card.Title
                          className="dashboard-text">{data[key]}</Card.Title>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
        }
      </Container>
    </>
  );
};
