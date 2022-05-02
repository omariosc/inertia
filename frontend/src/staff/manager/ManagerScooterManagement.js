/* Purpose of file: Display a list of all scooters and enable the manager
to create, delete and edit scooters. */

import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Form, Row, Table} from 'react-bootstrap';
import {NotificationManager} from 'react-notifications';
import {useAccount} from '../../authorize';
import host from '../../host';
import scooterStatus from '../../scooterStatus';
import {useNavigate} from 'react-router-dom';

/**
 * Renders the manager scooter management page, displays
 * a list of scooters
 * @return {JSX.Element} Manager scooter management page
 */
export default function ManagerScooterManagement() {
  const navigate = useNavigate();
  const [account] = useAccount();
  const [newID, setScooterNewId] = useState('');
  const [createID, setCreateId] = useState('');
  const [createDepo, setCreateDepo] = useState('');
  const [mapLocations, setMapLocations] = useState('');
  const [scooters, setScooters] = useState('');

  useEffect(() => {
    fetchScooters();
    fetchLocations();
  }, []);

  /**
   * Gets list of locations from backend server
   */
  async function fetchLocations() {
    try {
      const request = await fetch(host + 'api/Depos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });
      setMapLocations(await request.json());
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Gets list of scooters from backend server
   */
  async function fetchScooters() {
    try {
      const request = await fetch(host + 'api/admin/Scooters', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        mode: 'cors',
      });
      setScooters((await request.json()).sort(
          (a, b) => a.softScooterId - b.softScooterId));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Changes a given scooter's information and updates the backend server
   * @param {number} id ID of the scooter to edit
   * @param {number} mode 0 to change availability, 1 to change location,
   *                      2 to change ID, anything else to return scooter
   * @param {boolean} availability Current state of the scooter's availability
   * @param {string} location Current location of the scooter
   */
  async function editScooter(id, mode, availability = '', location = '') {
    const json = {};
    switch (mode) {
      case 0:
        json['available'] = !availability;
        break;
      case 1:
        if (location === '' || location === 'none') {
          return;
        } else {
          json['depoId'] = location;
        }
        break;
      case 2:
        if (!(newID.match(/^\d+$/))) {
          NotificationManager.error('Scooter ID must be an integer.', 'Error');
          return;
        } else {
          json['softScooterId'] = newID;
        }
        break;
      default:
        try {
          // eslint-disable-next-line max-len
          const request = await fetch(host + `api/admin/Scooters/${id}/return`,
              {
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
            NotificationManager.error('Could not return scooter.', 'Error');
          } else {
            NotificationManager.success('Returned scooter.', 'Success');
          }
        } catch (error) {
          console.error(error);
        }
        await fetchScooters();
        return;
    }

    try {
      const request = await fetch(host + `api/admin/Scooters/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        body: JSON.stringify(json),
        mode: 'cors',
      });
      const response = await request;
      if (response.status === 422) {
        NotificationManager.error('Scooter ID is already taken.', 'Error');
      } else if (response.status !== 200) {
        NotificationManager.error('Could not modify scooter.', 'Error');
      } else {
        NotificationManager.success('Modified scooter.', 'Success');
      }
    } catch (error) {
      console.error(error);
    }
    await fetchScooters();
  }

  /**
   * Creates a new scooter and updates the backend server
   */
  async function createScooter() {
    if (!(createID.match(/^\d+$/))) {
      NotificationManager.error('Scooter ID must be an integer.', 'Error');
      return;
    }
    for (const scooter in scooters) {
      if (createID === scooter.softScooterId) {
        NotificationManager.error('Scooter ID already exists.', 'Error');
        return;
      }
    }
    if (createDepo === '' || createDepo === 'none') {
      NotificationManager.error('Depot selection cannot be empty.', 'Error');
      return;
    }
    try {
      const request = await fetch(host + `api/admin/Scooters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        body: JSON.stringify({
          'softScooterId': parseInt(createID),
          'name': createID,
          'depoId': parseInt(createDepo),
          'available': true,
        }),
        mode: 'cors',
      });
      const response = await request;
      if (response.status === 422) {
        NotificationManager.error('Scooter ID is already taken.', 'Error');
      } else if (response.status !== 200) {
        NotificationManager.error('Could not create scooter.', 'Error');
      } else {
        NotificationManager.success('Created scooter.', 'Success');
      }
    } catch (error) {
      console.error(error);
    }
    await fetchScooters();
  }

  /**
   * Deletes the scooter with the ID provided
   * @param {number} id ID of the scooter to be deleted
   */
  async function deleteScooter(id) {
    try {
      const request = await fetch(host + `api/admin/Scooters/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        mode: 'cors',
      });
      const response = await request;
      if (response.status !== 200) {
        NotificationManager.error('Could not delete scooter.', 'Error');
      } else {
        NotificationManager.success('Deleted scooter.', 'Success');
      }
    } catch (error) {
      console.error(error);
    }
    await fetchScooters();
  }

  /**
   * Gets the scooter location for a scooter in case scooter location has been
   * deleted.
   * @param {number} idx Scooter ID
   * @return {string|*} Map location if depot exists, otherwise error message
   */
  function getMapName(idx) {
    try {
      if (mapLocations[scooters[idx].depoId - 1].name) {
        return mapLocations[scooters[idx].depoId - 1].name;
      }
    } catch (e) {
      return 'Depot no longer exists';
    }
  }

  return (
    <>
      <p id="breadcrumb">
        <a className="breadcrumb-list" onClick={() => {
          navigate('/dashboard');
        }}>Home</a> &gt; <b>
          <a className="breadcrumb-current" onClick={() => {
            navigate('/scooter-management');
          }}>Scooter Management</a></b>
      </p>
      <h3 id="pageName">Scooter Management</h3>
      <hr id="underline"/>
      <Container className="responsive-table">
        {(scooters === '') ?
              <p>Loading scooters...</p> :
              <Table className="table-formatting">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Availability</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {scooters.map((scooter, idx) => (
                    <tr key={idx}>
                      <td className="minWidthFieldLarge">
                        <Row className="sameLine">
                          <Col>{scooter.softScooterId}</Col>
                          <Col>
                            <Form.Control type="text"
                              onInput={(e) => setScooterNewId(
                                  e.target.value)}
                              size={20}/>
                          </Col>
                          <Col>
                            <Button className="buttonPaddingScooter"
                              onClick={() => {
                                if (scooter.scooterId !==
                                          parseInt(newID)) {
                                  editScooter(scooter.scooterId, 2);
                                } else {
                                  NotificationManager.error(
                                      'Scooter ID cannot be the same',
                                      'Error');
                                }
                              }}>
                              Edit
                            </Button>
                          </Col>
                        </Row>
                      </td>
                      <td className="minWidthFieldSmall">
                        {(scooter.available ?
                                <Button variant="danger"
                                  onClick={() => editScooter(
                                      scooter.scooterId, 0,
                                      scooter.available)}>
                                  Make Unavailable
                                </Button> :
                                <Button variant="success"
                                  onClick={() => editScooter(
                                      scooter.scooterId, 0,
                                      scooter.available)}>
                                  Make Available
                                </Button>
                        )}
                      </td>
                      <td className="minWidthFieldSmall">
                        {scooterStatus[scooter.scooterStatus]}
                      </td>
                      <td className="minWidthFieldLarge">
                        {(mapLocations === '') ?
                            <p>Loading map locations...</p> :
                            <>
                              <Form.Select className="minWidthFieldSmall"
                                defaultValue="none"
                                onChange={(e) => {
                                  if (e.target.value !==
                                                 scooter.depoId.toString()) {
                                    editScooter(scooter.scooterId, 1,
                                        '', e.target.value);
                                  }
                                }}>
                                <option value="none" key="none" disabled hidden>
                                  {getMapName(idx)}
                                </option>
                                {mapLocations.map((location, idx) => (
                                  <option value={location.depoId} key={idx}>
                                    {location.name}
                                  </option>
                                ))}
                              </Form.Select>
                            </>
                        }
                      </td>
                      <td>
                        {(scooter.scooterStatus === 2 ?
                                <Button variant="success"
                                  onClick={() => editScooter(
                                      scooter.scooterId, 3,
                                      scooter.available)}>
                                  Return Scooter
                                </Button> :
                                <Button onClick={() => deleteScooter(
                                    scooter.scooterId)}
                                variant="danger">
                                  Delete
                                </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
        }
        <Table className="table-formatting">
          <tbody>
            <tr>
              <td>
                <Form.Control className="minWidthFieldSmall" type="text"
                  placeholder="Enter ID"
                  onInput={(e) => setCreateId(e.target.value)}/>
              </td>
              <td>
                {(mapLocations === '') ?
                    <p>Loading map locations...</p> :
                    <Form>
                      <Form.Select className="minWidthFieldSmall"
                        defaultValue="none"
                        onChange={(e) => {
                          setCreateDepo(e.target.value);
                        }}>
                        <option value="none" key="none" disabled hidden>
                          Select location
                        </option>
                        {mapLocations.map((location, idx) => (
                          <option value={location.depoId} key={idx}>
                            {location.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form>
                }
              </td>
              <td>
                <Button onClick={createScooter}
                  variant="success">Create</Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </>
  );
};
