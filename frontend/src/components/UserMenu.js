import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {Dropdown, DropdownButton} from "react-bootstrap";
import React from "react";
import "./UserMenu.css";
import {useLocation, useNavigate} from "react-router-dom";
import {Link} from "@mui/material";

export default function userMenu() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <DropdownButton
            align="end"
            title={<span><i><FontAwesomeIcon icon={faUser}/></i></span>}
            className="user-menu float-right clickable"
        >
            <Dropdown.Item
                onClick={() => {
                    navigate('/login', {state: location})
                }}
            >
                Log in
            </Dropdown.Item>
            <Dropdown.Item
                onClick={() => {
                    navigate('/signup', {state: location})
                }}
            >
                Signup
            </Dropdown.Item>
            <Dropdown.Item>
                My Account
            </Dropdown.Item>
            <Dropdown.Item>
                Employee Dashboard
            </Dropdown.Item>
        </DropdownButton>
    );
}