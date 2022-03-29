import React, {useEffect, useState} from "react";
import {Dropdown, DropdownButton, Nav, Navbar} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import host from './host';
import Cookies from 'universal-cookie';
import LoginForm from "./Login";
import RegisterForm from "./Register";
import LandingPage from './LandingPage';
import CustomerInterface from "./CustomerInterface";
import ManagerInterface from './ManagerInterface';
import EmployeeInterface from './EmployeeInterface';
import {useDarkreader} from 'react-darkreader';
import './App.css';

const App = () => {
    const cookies = new Cookies();
    const center = [53.8, -1.55];
    const [map_locations, setMapLocations] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showCustomer, setShowCustomer] = useState(false);
    const [showManager, setShowManager] = useState(false);
    const [showEmployee, setShowEmployee] = useState(false);
    const [showLanding, setShowLanding] = useState(true);
    const [isDark, {toggle}] = useDarkreader(true);

    useEffect(() => {
        checkRole();
        fetchLocations();
    }, []);

    function checkRole() {
        if (cookies.get("accessToken")) {
            setShowLanding(false);
            switch (cookies.get("accountRole")) {
                case '1':
                    setShowEmployee(true);
                    break;
                case '2':
                    setShowManager(true);
                    break;
                default:
                    setShowLanding(true);
            }
        }
    }

    async function fetchLocations() {
        let request = await fetch(host + "api/Depos", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: "cors"
        });
        setMapLocations(await request.json());
    }

    function CustomerLogin() {
        setShowLogin(false);
        setShowRegister(false);
        setShowCustomer(true);
        setShowManager(false);
        setShowEmployee(false);
        setShowLanding(false);
    }

    function EmployeeLogin() {
        setShowLogin(false);
        setShowRegister(false);
        setShowCustomer(false);
        setShowManager(false);
        setShowEmployee(true);
        setShowLanding(false);
    }

    function ManagerLogin() {
        setShowLogin(false);
        setShowRegister(false);
        setShowCustomer(false);
        setShowManager(true);
        setShowEmployee(false);
        setShowLanding(false);
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
        cookies.remove('accountRole');
        cookies.remove('accountName');
    }

    return (
        <div id="wrapper">
            <div id="map-overlay">
                {(showLanding || showCustomer) ?
                    <div id="top-bar">
                        <DropdownButton
                            align="end"
                            title={<span><i><FontAwesomeIcon icon={faUser}/></i></span>}
                            className="dropdown-basic-button clickable"
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
                                            setShowRegister(true);
                                        }}>
                                        <p>Register</p>
                                    </Dropdown.Item>
                                </> : null}
                            {showCustomer ?
                                <>
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
                                </> : null}
                        </DropdownButton>
                    </div> :
                    <Navbar expand="lg" bg="primary" variant="dark" className="clickable">
                        <Navbar.Brand style={{paddingLeft: "15px"}}>INERTIA</Navbar.Brand>
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text className="navbar-pad-right">
                                Logged in as: <a>{cookies.get("accountName")}</a>
                            </Navbar.Text>
                            <Nav.Item className="navbar-pad-right">
                                <DropdownButton
                                    align="end"
                                    className="dropdown-basic-button"
                                    variant="dark"
                                    title={<span><i><FontAwesomeIcon icon={faUser}/></i></span>}
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
                                            setShowLanding(true);
                                        }}><p>Sign Out</p></Dropdown.Item>
                                </DropdownButton>
                            </Nav.Item>
                        </Navbar.Collapse>
                    </Navbar>}
                <LoginForm show={showLogin} showcustomer={CustomerLogin} showemployee={EmployeeLogin}
                           showmanager={ManagerLogin} onHide={() => setShowLogin(false)}/>
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
                <h5>Loading...</h5> :
                <>
                    {showLanding ? <LandingPage center={center} map_locations={map_locations}
                                                onHide={() => setShowLanding(false)}/>
                        : null}
                </>}
        </div>
    );
};

export default App;