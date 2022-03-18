import React, {useState} from "react";
import {Navbar, Nav, Dropdown, DropdownButton} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import ManagerInterface from './ManagerInterface.js';
import EmployeeInterface from './EmployeeInterface.js';
import './App.css'

const App = () => {
    const [showManager, setShowManager] = useState(false);
    const [showEmployee, setShowEmployee] = useState(false);
    return (
        <div id="wrapper">
            <Navbar expand="lg" bg="primary" variant="dark">
                <Navbar.Brand className="navbar-pad-left">
                    <img
                        src="favicon.ico"
                        width="45"
                        height="30"
                        alt=""
                        style={{paddingRight: "15px"}}
                    />
                    INERTIA
                </Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    {showManager ?
                        <Navbar.Text className="navbar-pad-right-right">
                            Signed in as: <a>Manager</a>
                        </Navbar.Text> : null}
                    {showEmployee ?
                        <Navbar.Text className="navbar-pad-right">
                            Signed in as: <a>Employee</a>
                        </Navbar.Text> : null}
                    <Nav.Item className="navbar-pad-right">
                        <DropdownButton
                            align="end"
                            id="dropdown-basic-button"
                            title={<span><i><FontAwesomeIcon icon={faUser}/></i></span>}
                            variant="light" menuVariant="light"
                        >
                            <Dropdown.Item
                                href="#/manager"
                                onClick={() => {
                                    setShowManager(true);
                                    setShowEmployee(false);
                                }}
                            >
                                <p>Login as Manager</p>
                            </Dropdown.Item>
                            <Dropdown.Item
                                href="#/employee"
                                onClick={() => {
                                    setShowManager(false);
                                    setShowEmployee(true);
                                }}
                            >
                                <p>Login as Employee</p>
                            </Dropdown.Item>
                            <Dropdown.Item
                                href="#/sign-out"
                                onClick={() => {
                                    setShowManager(false);
                                    setShowEmployee(false);
                                }}
                            >
                                <p>Sign Out</p>
                            </Dropdown.Item>
                        </DropdownButton>
                    </Nav.Item>
                </Navbar.Collapse>
            </Navbar>
            <br/>
            {showManager ? <ManagerInterface onHide={() => setShowManager(false)}/> : null}
            {showEmployee ? <EmployeeInterface onHide={() => setShowEmployee(false)}/> : null}
        </div>
    )
};

export default App;