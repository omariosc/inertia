import React from "react";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "bootstrap/dist/css/bootstrap.css"
import './LandingPage.css';

function LandingPage() {
    const center = [53.8, -1.55]
    const map_locations = [
        ["Trinity Centre", [53.798351, -1.545100]],
        ["Train Station", [53.796770, -1.540510]],
        ["Merrion Centre", [53.801270, -1.543190]],
        ["Leeds General Infirmary Hospital", [53.802509, -1.552887]],
        ["UoL Edge Sports Centre", [53.804167, -1.553208]]
    ]
    return (
        <MapContainer center={center} zoom={15} zoomControl={false}>
            <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            {map_locations.map((map_location, index) => (
                <Marker key={index} position={map_location[1]}>
                    <Popup>{map_location[0]}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default LandingPage;