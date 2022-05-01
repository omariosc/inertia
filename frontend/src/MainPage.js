/* Purpose of file: Landing page shown to a user not logged in */

import React, {useEffect, useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import host from './host';
import './MainPage.css';
import UserMenu from './components/UserMenu';
import {Outlet, useNavigate} from 'react-router-dom';

/**
 * Renders the landing page: a map of all depots
 * @return {JSX.Element} Default landing page
 */
export default function MainPage() {
  const [mapLocations, setMapLocations] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const centerLat = 53.80053044534111;
  const centerLong = -1.5460204298418807;

  useEffect(() => {
    fetchLocations();
  }, []);

  /**
   * Fetches the depots
   */
  async function fetchLocations() {
    try {
      const request = await fetch(host + 'api/Depos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });
      setMapLocations(await request.json());
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="menu-page">
      {/* sign out button */}
      <div className="my-account">
        <UserMenu/>
      </div>
      <div className="logo">
        <p>INERTIA</p>
      </div>
      <div className="side-bar">
        <Outlet context={[search, setSearch, mapLocations]}/>
      </div>
      {/* displaying visual map */}
      <div className="map-background">
        <MapContainer center={[centerLat, centerLong]} zoom={15}
          zoomControl={false} className="map-container">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          {mapLocations !== null &&
                mapLocations.map((location, index) => (
                  <Marker key={index}
                    position={[
                      location.latitude,
                      location.longitude]}
                    eventHandlers={{
                      click: () => {
                        setSearch(location.name);
                        navigate('/booking', {replace: true});
                      },
                    }}>
                    <Popup>{location.name}</Popup>
                  </Marker>
                ))
          }
        </MapContainer>
      </div>
    </div>
  );
};
