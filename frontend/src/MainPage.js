/*
	Purpose of file: Landing page shown to a user not logged in
*/

import React, {useEffect, useState} from "react";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import host from "./host";
import "./MainPage.css"
import UserMenu from './components/UserMenu';
import {Outlet, useNavigate} from "react-router-dom";

/**
 * Renders the landing page: a map of all depots
 * @param {ReactPropTypes} props 
 * @returns Default landing page
 */
export default function MainPage(props) {
    const [map_locations, setMapLocations] = useState(null);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const centerLat = 53.80053044534111;
    const centerLong = -1.5460204298418807;

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
        <div className={"menu-page"}>
            {/* sign out button */}
            <div className={"my-account"}>
                <UserMenu/>
            </div>
            <div className={"logo"}>
                <p>INERTIA</p>
            </div>
            <div className={"side-bar"}>
                <Outlet context={[search, setSearch, map_locations]}/>
            </div>
            {/* displaying visual map */}
            <div className={"map-background"}>
                <MapContainer center={[centerLat, centerLong]} zoom={15}
                              zoomControl={false} className="map-container">
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    {map_locations !== null &&
                        map_locations.map((map_location, index) => (
                            <Marker key={index}
                                    position={[map_location.latitude, map_location.longitude]}
                                    eventHandlers={{
                                        click: () => {
                                            setSearch(map_location.name);
                                            navigate("/booking", {replace:true});
                                        }
                                    }}>
                                <Popup>{map_location.name}</Popup>
                            </Marker>
                        ))
                    }
                </MapContainer>
            </div>
        </div>
    );
};