import React, {useEffect, useState} from "react";
import {Dropdown, DropdownButton} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import host from "./host";
import center from "./center";
import LoginForm from "./Login";
import RegisterForm from "./Register";
import Cookies from 'universal-cookie';
import {NotificationManager} from "react-notifications";

export default function LandingPage() {
    const [map_locations, setMapLocations] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const cookies = new Cookies();

    useEffect(() => {
        fetchLocations();
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
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <div id="overlay">
                <div id="top-bar">
                    <DropdownButton
                        align="end"
                        title={<span><i><FontAwesomeIcon icon={faUser}/></i></span>}
                        className="dropdown-basic-button clickable"
                    >
                        <Dropdown.Item
                            onClick={() => {
                                setShowLogin(true);
                                setShowRegister(false);
                            }}>Log In</Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => {
                                setShowLogin(false);
                                setShowRegister(true);
                            }}>Register</Dropdown.Item>
                    </DropdownButton>
                </div>
                <LoginForm show={showLogin} onHide={() => setShowLogin(false)}/>
                <RegisterForm show={showRegister} onHide={() => setShowRegister(false)}/>
            </div>
            {(map_locations === "") ?
                <h5>Loading map locations...</h5> :
                <MapContainer center={center} zoom={15} zoomControl={false} className="map-container">
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    {map_locations.map((map_location, index) => (
                        <Marker key={index} position={[map_location.latitude, map_location.longitude]}>
                            <Popup>{map_location.name}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            }
        </>
    );
};