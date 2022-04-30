/*
	Purpose of file: Expandable menu to navigate the application
*/

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faBars} from "@fortawesome/free-solid-svg-icons";
import {Dropdown, DropdownButton} from "react-bootstrap";
import React from "react";
import "./UserMenu.css";
import {useLocation, useNavigate} from "react-router-dom";
import {useAccount} from "../authorize";
import {NotificationManager} from "react-notifications";

/**
 * Returns the menu in the top right corner of the application
 */
export default function userMenu() {
    const location = useLocation();
    const navigate = useNavigate();
    const [account, signOut] = useAccount();

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
                account.role === '0' &&
              <Dropdown.Item
                disabled={true}
              >
                  {account.name}
              </Dropdown.Item> &&
                <Dropdown.Item onClick={() => {
                    navigate('/create-booking');
                }
                }>
                    My Account
                </Dropdown.Item>
            }

            {
                account != null &&
                <Dropdown.Item
                    onClick={() => {
                        signOut(() => {
                            NotificationManager.success('Logged out.', 'Success');
                            navigate('/');
                        });
                    }}
                >
                    Sign Out
                </Dropdown.Item>
            }
        </DropdownButton>
    );
}