import {Dropdown, DropdownButton, InputGroup, FormControl, Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.css"
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import React, {useState} from "react";
import './App.css';
import LoginForm from './Login.js'
import RegisterForm from './Register.js'


const center = [53.8, -1.55]
const map_locations = [
    ["Trinity Centre", [53.798351, -1.545100]],
    ["Train Station", [53.796770, -1.540510]],
    ["Merrion Centre", [53.801270, -1.543190]],
    ["Leeds General Infirmary Hospital", [53.802509, -1.552887]],
    ["UoL Edge Sports Centre", [53.804167, -1.553208]]
]


const App = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    return (
        <div id="wrapper">
            <MapContainer center={center} zoom={15}>
                <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                {map_locations.map((map_location, index) => (
                    <Marker key={index} position={map_location[1]}>
                        <Popup>{map_location[0]}</Popup>
                    </Marker>
                ))}
            </MapContainer>
            <div id="map-overlay">
                <div id="top-bar">
                    <InputGroup id="search-bar">
                        <FormControl
                            placeholder="Search"
                            aria-label="Search"
                            aria-describedby="basic-addon2"
                        />
                        <Button variant="secondary" id="button-addon2">
                            <i><FontAwesomeIcon icon={faMagnifyingGlass}/></i>
                        </Button>
                    </InputGroup>
                    <DropdownButton
                        id="dropdown-basic-button"
                        title={ <span><i><FontAwesomeIcon icon={faUser}/></i></span>}
                        variant="secondary" menuVariant="dark">
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
                    </DropdownButton>
                </div>
                <>
                    <LoginForm show={showLogin} onHide={() => setShowLogin(false)}/>
                    <RegisterForm show={showRegister} onHide={() => setShowRegister(false)}/>
                </>
            </div>
        </div>
    )
};


export default App;