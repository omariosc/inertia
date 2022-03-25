import React, {useEffect, useState} from "react";
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

const App = () => {
    const cookies = new Cookies();
    const center = [53.8, -1.55]
    const [map_locations, setMapLocations] = useState('');

    useEffect(() => {
        fetchLocations()
    }, []);

    async function fetchLocations() {
        try {
            let request = await fetch(host + "api/Depos", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                mode: "cors"
            });
            setMapLocations(await request.json());
        } catch (error) {
            console.error(error);
        }
    }

    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showCustomer, setShowCustomer] = useState(false);
    const [showManager, setShowManager] = useState(false);
    const [showEmployee, setShowEmployee] = useState(false);
    const [showLanding, setShowLanding] = useState(true);
    const [isDark, {toggle}] = useDarkreader(true);

    function CustomerLogin() {
        setShowLogin(false);
        setShowRegister(false);
        setShowCustomer(true);
        setShowManager(false);
        setShowEmployee(false);
        setShowLanding(false)
    }

    function EmployeeLogin() {
        setShowLogin(false);
        setShowRegister(false);
        setShowCustomer(false);
        setShowManager(false);
        setShowEmployee(true);
        setShowLanding(false)
    }

    function ManagerLogin() {
        setShowLogin(false);
        setShowRegister(false);
        setShowCustomer(false);
        setShowManager(true);
        setShowEmployee(false);
        setShowLanding(false)
    }

    async function signOut() {
        setShowLogin(false);
        setShowRegister(false);
        setShowCustomer(false);
        setShowManager(false);
        setShowEmployee(false);
        setShowLanding(true);
        try {
            await fetch(host + 'api/Users/authorize', {
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
                                    ><p>Sign Out</p>
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
                    <EmployeeInterface map_locations={map_locations} isDark={isDark} toggle={toggle}
                                       onHide={() => setShowEmployee(false)}/> : null}
                {showCustomer ?
                    <CustomerInterface map_locations={map_locations} isDark={isDark} toggle={toggle}
                                       onHide={() => setShowCustomer(false)}/> : null}
                {showManager ?
                    <ManagerInterface map_locations={map_locations} isDark={isDark} toggle={toggle}
                                      onHide={() => setShowManager(false)}/> : null}
            </div>
            {(map_locations === "") ?
                <h5>Loading...</h5>
                : <>
                    {showLanding ? <LandingPage center={center} map_locations={map_locations}
                                                onHide={() => setShowLanding(false)}/> : null}
                </>
            }
        </div>
    );
}

export default App;