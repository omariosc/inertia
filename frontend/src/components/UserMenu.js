import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faBars} from "@fortawesome/free-solid-svg-icons";
import {Dropdown, DropdownButton} from "react-bootstrap";
import React from "react";
import "./UserMenu.css";
import {useLocation, useNavigate} from "react-router-dom";
import Cookies from "universal-cookie";
import signOut from '../signout';

export default function userMenu() {
    const location = useLocation();
    const navigate = useNavigate();
    const cookies = new Cookies();

    let accountRole = cookies.get('accountRole');
    let accountName = cookies.get('accountName');

    return (
        <DropdownButton
            align="end"
            title={
            <div className={"user-menu-title"}>
                <div className={"burger-menu"}>
                    <FontAwesomeIcon icon={faBars} />
                </div>

                <div className={"icon"}>
                    <FontAwesomeIcon icon={faUser}/>
                </div>
            </div>}
            className="user-menu float-right clickable"
        >
            {
                accountName != null &&
                <Dropdown.Item
                    disabled={true}
                >
                    {accountName}
                </Dropdown.Item>
            }

            {
                accountRole == null &&
                <Dropdown.Item
                    onClick={() => {
                        navigate('/login', {state: location})
                    }}
                >
                    Log in
                </Dropdown.Item>
            }

            {
                accountRole == null &&
                <Dropdown.Item
                    onClick={() => {
                        navigate('/signup', {state: location})
                    }}
                >
                    Signup
                </Dropdown.Item>
            }

            {
                accountRole != null &&
                <Dropdown.Item>
                    My Account
                </Dropdown.Item>
            }


            {
                accountRole === '1' &&
                <Dropdown.Item
                    onClick={() => {
                        navigate('dashboard', {state: location})
                    }}
                >
                    Employee Dashboard
                </Dropdown.Item>
            }

            {
                accountRole === '2' &&
                <Dropdown.Item
                    onClick={() => {
                        navigate('dashboard', {state: location})
                    }}
                >
                    Manager Dashboard
                </Dropdown.Item>
            }

            {
                accountRole != null &&
                <Dropdown.Item
                    onClick={() => {
                        navigate('/');
                        signOut().then(r => r);
                    }}
                >
                    Sign Out
                </Dropdown.Item>
            }
        </DropdownButton>
    );
}