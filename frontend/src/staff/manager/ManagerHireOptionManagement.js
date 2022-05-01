/* Purpose of file: Show the current hire options and their prices
and allow the manager to change them */

import React, {useEffect, useState} from 'react';
import {Button, Container, Form, Table} from 'react-bootstrap';
import {NotificationManager} from 'react-notifications';
import {useAccount} from '../../authorize';
import host from '../../host';
import {useNavigate} from 'react-router-dom';

/**
 * Renders the manager hire option management, displays current hire
 * options and their prices
 * @return {JSX.Element} Manager hire option management page
 */
export default function ManagerHireOptionManagement() {
  const navigate = useNavigate();
  const [account] = useAccount();
  const [hireOptions, setHireOptions] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState('');
  const [createDuration, setCreateDuration] = useState('');
  const [createName, setCreateName] = useState('');
  const [createCost, setCreateCost] = useState('');

  useEffect(() => {
    fetchHirePeriods();
  }, []);

  /**
   * Gets current hire periods from backend server
   */
  async function fetchHirePeriods() {
    try {
      const request = await fetch(host + 'api/HireOptions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        mode: 'cors',
      });
      setHireOptions((await request.json()).sort(
          (a, b) => a.durationInHours - b.durationInHours));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Edits a specific hire option with the provided ID and updates
   * backend server
   * @param {number} id ID of the hire option to edit
   * @param {number} mode 1 to change name, 2 to change price.
   *                      Anything else to change duration
   */
  async function editHireOption(id, mode) {
    const json = {};
    switch (mode) {
      case 1:
        if (newName === '') {
          NotificationManager.error('Hire option name cannot be empty.',
              'Error');
          return;
        } else {
          json['name'] = newName;
        }
        break;
      case 2:
        if (!(newCost.match(/^\d+(\.\d{0,2})?$/))) {
          NotificationManager.error('Cost must be a valid price.', 'Error');
          return;
        } else if (parseFloat(newCost) <= 0) {
          NotificationManager.error('Cost must be greater than 0.', 'Error');
          return;
        } else {
          json['cost'] = parseFloat(newCost);
        }
        break;
      default:
        if (!(newDuration.match(/^\d+$/))) {
          NotificationManager.error('Duration must be an integer.', 'Error');
          return;
        } else if (parseFloat(createDuration) <= 0) {
          NotificationManager.error('Duration must be at least 1.', 'Error');
          return;
        } else {
          json['durationInHours'] = parseInt(newDuration);
        }
        break;
    }
    try {
      const request = await fetch(host + `api/admin/HireOptions/${id}`, {
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
      if (response.status !== 200) {
        NotificationManager.error('Could not modify hire option.', 'Error');
      } else {
        NotificationManager.success('Modified hire option.', 'Success');
      }
    } catch (error) {
      console.error(error);
    }
    await fetchHirePeriods();
  }

  /**
   * Creates a new hire option with the provided form and updates
   * the backend server
   */
  async function createHireOption() {
    if (!(createDuration.match(/^\d+$/))) {
      NotificationManager.error('Duration must be an integer.', 'Error');
      return;
    } else if (parseFloat(createDuration) <= 0) {
      NotificationManager.error('Duration must be at least 1.', 'Error');
      return;
    }
    if (createName === '') {
      NotificationManager.error('Hire option name cannot be empty.', 'Error');
      return;
    }
    if (!(createCost.match(/^\d+(\.\d{0,2})?$/))) {
      NotificationManager.error('Cost must be a valid price.', 'Error');
      return;
    } else if (parseFloat(newCost) <= 0) {
      NotificationManager.error('Cost must be greater than 0.', 'Error');
      return;
    }
    try {
      const request = await fetch(host + `api/admin/HireOptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${account.accessToken}`,
        },
        body: JSON.stringify({
          'durationInHours': createDuration,
          'name': createName,
          'cost': createCost,
        }),
        mode: 'cors',
      });
      const response = await request;
      if (response.status !== 200) {
        NotificationManager.error('Could not create hire option.', 'Error');
      } else {
        NotificationManager.success('Created hire option.', 'Success');
      }
    } catch (error) {
      console.error(error);
    }
    await fetchHirePeriods();
  }

  /**
   * Deletes a hire option with the provided ID
   * @param {number} id ID of the hire option to be deleted
   */
  async function deleteHireOption(id) {
    try {
      const request = await fetch(host + `api/admin/HireOptions/${id}`, {
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
        NotificationManager.error('Could not delete hire option.', 'Error');
      } else {
        NotificationManager.success('Deleted hire option.', 'Success');
      }
    } catch (error) {
      console.error(error);
    }
    await fetchHirePeriods();
  }

  return (
    <>
      <p id="breadcrumb">
        <a className="breadcrumb-list" onClick={() => {
          navigate('/dashboard');
        }}>Home</a> &gt; <b>
          <a className="breadcrumb-current" onClick={() => {
            navigate('/hire-option-management');
          }}>Hire Option Management</a></b>
      </p>
      <h3 id="pageName">Hire Option Management</h3>
      <hr id="underline"/>
      <Container className="responsive-table">
        {(hireOptions === '') ?
              <p>Loading hire options...</p> :
              <Table className="table-formatting">
                <thead>
                  <tr>
                    <th>Duration (hours)</th>
                    <th>Name</th>
                    <th>Cost (£)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {hireOptions.map((hireOption, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="sameLine">
                          <div className="maxWidth">
                            {hireOption.durationInHours}
                          </div>
                          <Form.Control type="number"
                            onInput={(e) => setNewDuration(
                                e.target.value)}
                            size={12}/>
                          <div className="buttonPadding">
                            <Button onClick={() => {
                              if (hireOption.durationInHours !==
                                  parseInt(newDuration)) {
                                editHireOption(hireOption.hireOptionId, 0);
                              } else {
                                NotificationManager.error(
                                    'Duration cannot be the same.', 'Error');
                              }
                            }}>
                              Edit
                            </Button>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="sameLine">
                          <div
                            className="maxWidthLong"> {hireOption.name} </div>
                          <Form.Control type="text" onInput={(e) => setNewName(
                              e.target.value)} size={12}/>
                          <div className="buttonPadding">
                            <Button onClick={() => {
                              if (hireOption.name !== newName) {
                                editHireOption(hireOption.hireOptionId, 1);
                              } else {
                                NotificationManager.error(
                                    'Name cannot be the same.', 'Error');
                              }
                            }}>
                              Edit
                            </Button>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="sameLine">
                          <div className="maxWidthLong">{hireOption.cost}</div>
                          <Form.Control type="price" onInput={(e) => setNewCost(
                              e.target.value)} size={12}/>
                          <div className="buttonPadding">
                            <Button onClick={() => {
                              if (parseFloat(hireOption.cost) !==
                                  parseFloat(newCost)) {
                                editHireOption(hireOption.hireOptionId, 2);
                              } else {
                                NotificationManager.error(
                                    'Cost cannot be the same.', 'Error');
                              }
                            }}>
                              Edit
                            </Button>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Button
                          onClick={() => deleteHireOption(
                              hireOption.hireOptionId)}
                          variant="danger">
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
        }
        <Table className="table-formatting">
          <tbody>
            <tr>
              <td className="minWidthFieldSmall">
                <Form.Control type="number"
                  placeholder="Enter duration value"
                  onInput={(e) => setCreateDuration(
                      e.target.value)}/>
              </td>
              <td className="minWidthFieldSmall">
                <Form.Control type="text" placeholder="Enter name"
                  onInput={(e) => setCreateName(e.target.value)}/>
              </td>
              <td className="minWidthFieldSmall">
                <Form.Control type="price" placeholder="Enter cost"
                  onInput={(e) => setCreateCost(e.target.value)}/>
              </td>
              <td>
                <Button onClick={createHireOption}
                  variant="success">Create</Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </>
  );
};
