import {Dropdown, DropdownButton, InputGroup, FormControl, Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.css"
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";

import './App.css';

const center = [53.8, -1.55]
const map_locations = [
    ["Trinity Centre", [53.798351, -1.545100]],
    ["Train Station", [53.796770, -1.540510]],
    ["Merrion Centre", [53.801270, -1.543190]],
    ["Leeds General Infirmary Hospital", [53.802509, -1.552887]],
    ["UoL Edge Sports Centre", [53.804167, -1.553208]]
]


const App = () => {
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
                        <Dropdown.Item href="#/action-1"><p>Log In</p></Dropdown.Item>
                        <Dropdown.Item href="#/action-2"><p>Sign Up</p></Dropdown.Item>
                        <Dropdown.Item href="#/action-3"><p>Toggle Dark mode</p></Dropdown.Item>
                    </DropdownButton>
                </div>
            </div>
        </div>
    )
};


export default App;