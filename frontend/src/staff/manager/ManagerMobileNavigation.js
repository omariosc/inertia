/* Purpose of file: Navigation bar for manager accounts on mobile devices */

import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Nav} from 'react-bootstrap';
import {
  MdCreate,
  MdDashboard,
  MdElectricScooter,
  MdManageAccounts,
  MdSettings,
} from 'react-icons/md';
import {FaExclamation} from 'react-icons/fa';
import {GiHamburgerMenu} from 'react-icons/gi';
import {CgClose} from 'react-icons/cg';
import {RiBuilding3Fill} from 'react-icons/ri';
import {IoIosStats} from 'react-icons/io';
import {useAccount} from '../../authorize';

/**
 * Renders the manager mobile navigation bar, allowing for the browsing of the
 * application on mobile devices
 * @return {JSX.Element} Manager mobile navbar
 */
export default function ManagerMobileNavigation() {
  const [open, setOpen] = useState(false);
  const hamburgerIcon = <GiHamburgerMenu className="hamburger-menu-staff"
    color="white" size="35px"
    onClick={() => setOpen(!open)}/>;
  const closeIcon = <CgClose className="hamburger-menu-staff" color="white"
    size="35px" onClick={() => setOpen(!open)}/>;
  const [, signOut] = useAccount();
  const navigate = useNavigate();

  /**
   * Sets up the side navigation bar of links to browse the application
   * @return {JSX.Element} The group of links for the navbar
   */
  function Links() {
    return (
      <Nav
        defaultActiveKey="/dashboard"
        variant="pills"
        className="manager-vert-navbar-mobile medium-padding-left text-black"
      >
        <Nav.Link as={Link} to="/dashboard">
          <MdDashboard/> Dashboard
        </Nav.Link>
        <Nav.Link as={Link} to="/scooter-management">
          <MdElectricScooter/> Scooter Management
        </Nav.Link>
        <Nav.Link as={Link} to="/hire-option-management">
          <MdCreate/> Hire Option Management
        </Nav.Link>
        <Nav.Link as={Link} to="/depot-management">
          <RiBuilding3Fill/> Depot Management
        </Nav.Link>
        <Nav.Link as={Link} to="/issues">
          <FaExclamation/> Issues
        </Nav.Link>
        <Nav.Link as={Link} to="/statistics">
          <IoIosStats/> Statistics
        </Nav.Link>
        <Nav.Link as={Link} to="/account-management">
          <MdManageAccounts/> Account Management
        </Nav.Link>
        <Nav.Link as={Link} to="/settings">
          <MdSettings/> Settings
        </Nav.Link>
        <Nav.Link as={Link} to="/" onClick={() => {
          signOut();
          navigate('/');
        }}>
            Sign Out</Nav.Link>
      </Nav>);
  }

  return (
    <div>
      {open ? closeIcon : hamburgerIcon}
      {open && <Links/>}
    </div>
  );
}
