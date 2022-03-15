import React from "react";
import {DropdownButton, Dropdown, Button, InputGroup} from "react-bootstrap";
import './Manager.css';

function AccountManagement() {
    return (
        <>
            <h1>Account Management</h1>
            <h3>Name</h3>
            <InputGroup className="mb-3">
                <input name="name" placeholder="Enter employee name" required/>
            </InputGroup>
            <h3>Username</h3>
            <InputGroup className="mb-3">
                <input name="username" placeholder="Enter employee username" required/>
            </InputGroup>
            <h3>Email</h3>
            <InputGroup className="mb-3">
                <input name="email" placeholder="Enter employee email" required/>
            </InputGroup>
            <Button bg="dark">Create account</Button>
        </>
    );
}

export default AccountManagement;