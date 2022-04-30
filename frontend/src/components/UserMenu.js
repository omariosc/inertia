import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faBars} from "@fortawesome/free-solid-svg-icons";
import {Dropdown, DropdownButton} from "react-bootstrap";
import React from "react";
import "./UserMenu.css";
import {useLocation, useNavigate} from "react-router-dom";
import {signOut, useAccount} from "../authorize";

export default function userMenu(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const [account, signOut, signIn] = useAccount();

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
                account != null &&
                <Dropdown.Item
                    disabled={true}
                >
                    {account.name}
                </Dropdown.Item>
            }

            {
                account == null &&
                <Dropdown.Item
                    onClick={() => {
                        navigate('/login', {state: location})
                    }}
                >
                    Log in
                </Dropdown.Item>
            }

            {
                account === null &&
                <Dropdown.Item
                    onClick={() => {
                        navigate('/signup', {state: location})
                    }}
                >
                    Signup
                </Dropdown.Item>
            }

            {
                account != null &&
                <Dropdown.Item onClick={() => {
                    navigate('/create-booking');
                }
                }>
                    My Account
                </Dropdown.Item>
            }


            {
                account != null &&
                account.role === '1' &&
                <Dropdown.Item
                    onClick={() => {
                        navigate('/dashboard');
                    }}
                >
                    Employee Dashboard
                </Dropdown.Item>
            }

            {
                account != null &&
                account.role === '2' &&
                <Dropdown.Item
                    onClick={() => {
                        navigate('/dashboard');
                    }}
                >
                    Manager Dashboard
                </Dropdown.Item>
            }

            {
                account != null &&
                <Dropdown.Item
                    onClick={() => {
                        signOut();
                        navigate('/');
                    }}
                >
                    Sign Out
                </Dropdown.Item>
            }
        </DropdownButton>
    );
}