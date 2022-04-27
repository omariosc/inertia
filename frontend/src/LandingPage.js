import React, {useEffect, useState} from "react";
import {Dropdown, DropdownButton} from "react-bootstrap";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import LoginForm from "./Login";
import RegisterForm from "./Register";
import host from "./host";

export default function LandingPage() {
    const [map_locations, setMapLocations] = useState('');
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        fetchLocations();
    }, []);

    // Fetches the depots.
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
                {/* sign out button */}
                <div id="top-bar">
                    <DropdownButton
                        align="end"
                        title={<span><i><FontAwesomeIcon icon={faUser}/></i></span>}
                        className="float-right clickable"
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
                {/* login and register modals */}
                <LoginForm show={showLogin} onHide={() => setShowLogin(false)}/>
                <RegisterForm show={showRegister} onHide={() => setShowRegister(false)}/>
            </div>
            {/* displaying visual map */}
            {(map_locations === "") ?
                <p>Loading map locations...</p> :
                <MapContainer center={[map_locations[0].latitude, map_locations[0].longitude]} zoom={15}
                              zoomControl={false} className="map-container">
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