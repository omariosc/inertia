import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";

export default function LandingPage({center, map_locations}) {
    return (
        <MapContainer center={center} zoom={15} zoomControl={false}>
            <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            {map_locations.map((map_location, index) => (
                <Marker key={index} position={[map_location.latitude, map_location.longitude]}>
                    <Popup>{map_location.name}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};