import React, {useState} from "react";
import {Navbar, Nav, Dropdown, DropdownButton, Button} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import ManagerInterface from './ManagerInterface.js';
import EmployeeInterface from './EmployeeInterface.js';
import './App.css'

const App = () => {
    const [showManager, setShowManager] = useState(false);
    const [showEmployee, setShowEmployee] = useState(false);
    const [showInterfaceToggle, setShowInterfaceToggle] = useState(true);
    return (
        <div id="wrapper">
            <Navbar expand="lg" bg="dark" variant="dark">
                <Navbar.Brand className="navbar-pad-left">
                    <img
                        src="favicon.ico"
                        width="30"
                        height="30"
                        alt=""
                    />
                    INERTIA
                </Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    {showManager ?
                        <Navbar.Text className="navbar-pad-right">
                            Signed in as: <a href="#/settings">Manager</a>
                        </Navbar.Text> : null}
                    {showEmployee ?
                        <Navbar.Text className="navbar-pad-right">
                            Signed in as: <a href="#/settings">Employee</a>
                        </Navbar.Text> : null}
                    <Nav.Item className="navbar-pad-right">
                        <DropdownButton
                            align="end"
                            id="dropdown-basic-button"
                            title={<span><i><FontAwesomeIcon icon={faUser}/></i></span>}
                            variant="secondary" menuVariant="dark"
                        >
                            <Dropdown.Item
                                href="#/sign-out"
                                onClick={() => {
                                    setShowManager(false);
                                    setShowEmployee(false);
                                    setShowInterfaceToggle(true);
                                }}
                            >
                                <p>Sign Out</p>
                            </Dropdown.Item>
                        </DropdownButton>
                    </Nav.Item>
                </Navbar.Collapse>
            </Navbar>
            {showInterfaceToggle ? <Button
                onClick={() => {
                    setShowManager(true);
                    setShowEmployee(false);
                    setShowInterfaceToggle(false);
                }}
            >
                Log in as Manager
            </Button> : null}
            {showInterfaceToggle ? <Button
                onClick={() => {
                    setShowManager(false);
                    setShowEmployee(true);
                    setShowInterfaceToggle(false);
                }}
            >
                Log in as Employee
            </Button> : null}
            {showManager ? <ManagerInterface onHide={() => setShowManager(false)}/> : null}
            {showEmployee ? <EmployeeInterface onHide={() => setShowEmployee(false)}/> : null}
        </div>
    )
};

export default App;