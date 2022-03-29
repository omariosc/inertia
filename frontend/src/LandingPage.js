import React, {useState} from "react";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "bootstrap/dist/css/bootstrap.css";
import {Button, Card, Col, Container, FormControl, InputGroup, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import Order from "./Order";

export default function LandingPage({center, map_locations}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [bookingDepot, setBookingDepot] = useState(map_locations[0].name);
    const [showPayment, setShowPayment] = useState(false);
    return (
        <>
            <MapContainer center={center} zoom={15} zoomControl={false}>
                <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                {map_locations.map((map_location, index) => (
                    <Marker key={index} position={[map_location.latitude, map_location.longitude]}>
                        <Popup>{map_location.name}</Popup>
                    </Marker>
                ))}
            </MapContainer>
            <div id="search-overlay">
                <Container fluid>
                    <Row>
                        <Col xs={7} md={3}>
                            <InputGroup id="search-bar" className="clickable" onChange={event => {
                                setSearchTerm(event.target.value)
                            }}>
                                <FormControl placeholder="Search"/>
                                <Button id="button-addon2">
                                    <i><FontAwesomeIcon icon={faMagnifyingGlass}/></i>
                                </Button>
                            </InputGroup>
                        </Col>
                        <Col xs={5} md={9}/>
                    </Row>
                    <Row className={"flex-grow-1"}>
                        <Col xs={7} md={3}>
                            <Card className={"clickable search-results"}>
                                <Card.Title>Search results</Card.Title>
                                <ListGroup style={{padding: "5px"}}>
                                    {map_locations.filter((map_location) => {
                                        if (searchTerm === "") {
                                            return map_location;
                                        } else if (map_location.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                            return map_location;
                                        return null;
                                    }).map((map_location, idx) => {
                                        return (
                                            <ListGroupItem className={"order"} key={idx}>
                                                <Card>
                                                    <Card.Body style={{padding: "5px"}}>
                                                        <div style={{float: 'left'}}>
                                                            <b>{map_location.name}</b>
                                                        </div>
                                                        <div style={{float: 'right'}}>
                                                            <Button onClick={() => {
                                                                setShowPayment(true);
                                                                setBookingDepot(map_location.name)
                                                            }}>Book Scooter</Button>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </ListGroupItem>
                                        );
                                    })}
                                </ListGroup>
                            </Card>
                        </Col>
                        <Col xs={5} md={9}/>
                    </Row>
                </Container>
                {showPayment ?
                    <Order show={showPayment} onHide={() => setShowPayment(false)} location={bookingDepot}/>
                    : null}
            </div>
        </>
    );
};