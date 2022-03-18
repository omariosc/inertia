import React, {useState} from "react";
import {Navbar, Nav, Dropdown, DropdownButton} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import LoginForm from "./Login";
import RegisterForm from "./Register";
import LandingPage from './LandingPage'
import ManagerInterface from './ManagerInterface';
import EmployeeInterface from './EmployeeInterface';
import './App.css'

const App = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showManager, setShowManager] = useState(false);
    const [showEmployee, setShowEmployee] = useState(false);
    const [showLanding, setShowLanding] = useState(true);
    return (
        <div id="wrapper">
            <div id="map-overlay">
                {showLanding ?
                    <div id="top-bar">
                        <DropdownButton
                            align="end"
                            id="dropdown-basic-button"
                            title={<span><i><FontAwesomeIcon icon={faUser}/></i></span>}
                            variant="primary" menuVariant="primary"
                        >
                            {showLanding ?
                                <Dropdown.Item
                                    href="#/login"
                                    onClick={() => {
                                        setShowLogin(true);
                                        setShowRegister(false);
                                    }}>
                                    <p>Log In</p>
                                </Dropdown.Item> : null}
                            {showLanding ? <Dropdown.Item
                                href="#/register"
                                onClick={() => {
                                    setShowLogin(false);
                                    setShowRegister(true);
                                }}>
                                <p>Register</p>
                            </Dropdown.Item> : null}
                            <Dropdown.Item
                                href="#/manager"
                                onClick={() => {
                                    setShowLogin(false);
                                    setShowRegister(false);
                                    setShowManager(true);
                                    setShowEmployee(false);
                                    setShowLanding(false)
                                }}
                            >
                                <p>Login as Manager</p>
                            </Dropdown.Item>
                            <Dropdown.Item
                                href="#/employee"
                                onClick={() => {
                                    setShowLogin(false);
                                    setShowRegister(false);
                                    setShowManager(false);
                                    setShowEmployee(true);
                                    setShowLanding(false)
                                }}
                            >
                                <p>Login as Employee</p>
                            </Dropdown.Item>
                            <Dropdown.Item
                                href="#/sign-out"
                                onClick={() => {
                                    setShowLogin(false);
                                    setShowRegister(false);
                                    setShowManager(false);
                                    setShowEmployee(false);
                                    setShowLanding(true)
                                }}
                            >
                                <p>Sign Out</p>
                            </Dropdown.Item>
                        </DropdownButton>
                    </div> :
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
                                    variant="light" menuVariant="primary"
                                >
                                    {showLanding ?
                                        <Dropdown.Item
                                            href="#/login"
                                            onClick={() => {
                                                setShowLogin(true);
                                                setShowRegister(false);
                                            }}>
                                            <p>Log In</p>
                                        </Dropdown.Item> : null}
                                    {showLanding ? <Dropdown.Item
                                        href="#/register"
                                        onClick={() => {
                                            setShowLogin(false);
                                            setShowRegister(true);
                                        }}>
                                        <p>Register</p>
                                    </Dropdown.Item> : null}
                                    <Dropdown.Item
                                        href="#/manager"
                                        onClick={() => {
                                            setShowLogin(false);
                                            setShowRegister(false);
                                            setShowManager(true);
                                            setShowEmployee(false);
                                            setShowLanding(false)
                                        }}
                                    >
                                        <p>Login as Manager</p>
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="#/employee"
                                        onClick={() => {
                                            setShowLogin(false);
                                            setShowRegister(false);
                                            setShowManager(false);
                                            setShowEmployee(true);
                                            setShowLanding(false)
                                        }}
                                    >
                                        <p>Login as Employee</p>
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="#/sign-out"
                                        onClick={() => {
                                            setShowLogin(false);
                                            setShowRegister(false);
                                            setShowManager(false);
                                            setShowEmployee(false);
                                            setShowLanding(true)
                                        }}
                                    >
                                        <p>Sign Out</p>
                                    </Dropdown.Item>
                                </DropdownButton>
                            </Nav.Item>
                        </Navbar.Collapse>
                    </Navbar>}
                <LoginForm show={showLogin} onHide={() => setShowLogin(false)}/>
                {showLanding ? null : <br/>}
                <RegisterForm show={showRegister} onHide={() => setShowRegister(false)}/>
                {showManager ? <ManagerInterface onHide={() => setShowManager(false)}/> : null}
                {showEmployee ? <EmployeeInterface onHide={() => setShowEmployee(false)}/> : null}
            </div>
            {showLanding ? <LandingPage onHide={() => setShowLanding(false)}/> : null}
        </div>
    );
}

export default App;