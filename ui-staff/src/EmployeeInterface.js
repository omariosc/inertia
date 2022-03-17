import React, {useState} from "react";
import {Nav, Row, Col} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Settings from './StaffSettings.js';
import './StaffInterface.css';

function EmployeeInterface() {
    const [showSettings, setShowSettings] = useState(true);
    return (
        <div id="wrapper">
            <Row>
                <Col xs={2}>
                    <Nav
                        defaultActiveKey="#dashboard"
                        variant="pills"
                        className="flex-column vertical-navbar"
                    >
                        <Nav.Link onClick={() => {
                            setShowSettings(true)
                        }}
                                  href="#/settings">Settings</Nav.Link>
                    </Nav>
                </Col>
                <Col xs={9}>
                    <>
                        {showSettings ? <Settings onHide={() => setShowSettings(false)}/> : null}
                    </>
                </Col>
            </Row>
        </div>
    )
};

export default EmployeeInterface;