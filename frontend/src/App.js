import React, {useState} from "react";
import {Navbar, Nav, Dropdown, DropdownButton} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import LoginForm from "./Login";
import RegisterForm from "./Register";
import LandingPage from './LandingPage'
import CustomerInterface from "./CustomerInterface";
import ManagerInterface from './ManagerInterface';
import EmployeeInterface from './EmployeeInterface';
import './App.css'
import {useDarkreader} from 'react-darkreader';
import host from './host';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const App = () => {
    const center = [53.8, -1.55]
    const map_locations = [
        ["Trinity Centre", [53.798351, -1.545100]],
        ["Train Station", [53.796770, -1.540510]],
        ["Merrion Centre", [53.801270, -1.543190]],
        ["Leeds General Infirmary Hospital", [53.802509, -1.552887]],
        ["UoL Edge Sports Centre", [53.804167, -1.553208]]
    ]
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showCustomer, setShowCustomer] = useState(false);
    const [showManager, setShowManager] = useState(false);
    const [showEmployee, setShowEmployee] = useState(false);
    const [showLanding, setShowLanding] = useState(true);
    const [isDark, {toggle}] = useDarkreader(true);
    let selectedLocation = null;

    if (cookies.get('accountToken')) {
        setShowLanding(false);
        setShowManager(true);
    }

    function Book(location) {
        setShowLogin(false);
        setShowRegister(false);
        setShowCustomer(true);
        setShowManager(false);
        setShowEmployee(false);
        setShowLanding(false);
        selectedLocation = location[0];
        cookies.set('selectedLocation', selectedLocation, {path: '/'});
    }

    function CustomerLogin() {
        setShowLogin(false);
        setShowRegister(false);
        setShowCustomer(true);
        setShowManager(false);
        setShowEmployee(false);
        setShowLanding(false);
        cookies.remove('selectedLocation');
    }

    function EmployeeLogin() {
        setShowLogin(false);
        setShowRegister(false);
        setShowCustomer(false);
        setShowManager(false);
        setShowEmployee(true);
        setShowLanding(false);
        cookies.remove('selectedLocation');
    }

    function ManagerLogin() {
        setShowLogin(false);
        setShowRegister(false);
        setShowCustomer(false);
        setShowManager(true);
        setShowEmployee(false);
        setShowLanding(false);
        cookies.remove('selectedLocation');
    }

    async function signOut() {
        setShowLogin(false);
        setShowRegister(false);
        setShowCustomer(false);
        setShowManager(false);
        setShowEmployee(false);
        setShowLanding(true);
        try {
            const request = await fetch(host + 'api/Users/authorize', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    'accessToken': cookies.get('accessToken')
                }),
                mode: "cors"
            });
        } catch (error) {
            console.error(error);
        }
        cookies.remove('accessToken');
        cookies.remove('accountID');
    }

    return (
        <div id="wrapper">
            <div id="map-overlay">
                {(showLanding || showCustomer) ?
                    <div id="top-bar">
                        <DropdownButton
                            align="end"
                            title={<span><i><FontAwesomeIcon icon={faUser}/></i></span>}
                            variant="primary"
                            className="dropdown-basic-button clickable"
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
                                href="#/sign-out"
                                onClick={() => {
                                    signOut();
                                    setShowLogin(false);
                                    setShowRegister(false);
                                    setShowCustomer(false);
                                    setShowManager(false);
                                    setShowEmployee(false);
                                    setShowLanding(true)
                                }}
                            >
                                <p>Sign Out</p>
                            </Dropdown.Item>
                        </DropdownButton>
                    </div> :
                    <Navbar expand="lg" bg="primary" variant="dark" className="clickable">
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
                                    Signed in as: <u>Manager</u>
                                </Navbar.Text> : null}
                            {showEmployee ?
                                <Navbar.Text className="navbar-pad-right">
                                    Signed in as: <u>Employee</u>
                                </Navbar.Text> : null}
                            <Nav.Item className="navbar-pad-right">
                                <DropdownButton
                                    align="end"
                                    className="dropdown-basic-button"
                                    title={<span><i><FontAwesomeIcon icon={faUser}/></i></span>}
                                    variant="light"
                                >
                                    {showLanding ?
                                        <>
                                            <Dropdown.Item
                                                href="#/login"
                                                onClick={() => {
                                                    setShowLogin(true);
                                                    setShowRegister(false);
                                                }}>
                                                <p>Log In</p>
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                href="#/register"
                                                onClick={() => {
                                                    setShowLogin(false);
                                                    setShowRegister(false);
                                                    setShowManager(true);
                                                }}>
                                                <p>Register</p>
                                            </Dropdown.Item>
                                        </> : null}
                                    <Dropdown.Item
                                        href="#/sign-out"
                                        onClick={() => {
                                            signOut();
                                            setShowLogin(false);
                                            setShowRegister(false);
                                            setShowCustomer(false);
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
                <LoginForm show={showLogin} onCustomer={CustomerLogin} onEmployee={EmployeeLogin}
                           onManager={ManagerLogin} onHide={() => setShowLogin(false)}/>
                {showLanding ? null : <br/>}
                <RegisterForm show={showRegister} onHide={() => setShowRegister(false)}/>
                {showEmployee ?
                    <EmployeeInterface isDark={isDark} toggle={toggle} onHide={() => setShowEmployee(false)}/> : null}
                {showCustomer ?
                    <CustomerInterface isDark={isDark} toggle={toggle} onHide={() => setShowCustomer(false)}/> : null}
                {showManager ?
                    <ManagerInterface isDark={isDark} toggle={toggle} onHide={() => setShowManager(false)}/> : null}
            </div>
            {showLanding ? <LandingPage center={center} map_locations={map_locations} Book={Book}
                                        onHide={() => setShowLanding(false)}/> : null}
        </div>
    );
}

export default App;