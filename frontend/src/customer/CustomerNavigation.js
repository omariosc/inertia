import React from "react";
import {Link} from "react-router-dom";
import {Nav} from "react-bootstrap";
import {MdCreate, MdDashboard, MdElectricScooter, MdManageAccounts, MdSettings} from "react-icons/md";
import {FaExclamation} from "react-icons/fa";
import {RiBuilding3Fill} from "react-icons/ri";
import {IoIosStats} from "react-icons/io";

export default function CustomerNavigation() {
   return (
       <Nav defaultActiveKey="#/create-bookings" className="customer-navigation align-items-end">
           <Nav.Link as={Link} className="hover-black" to="/create-booking">Create Booking</Nav.Link>
           <Nav.Link as={Link} className="hover-black" to="/current-bookings">Current
               Bookings</Nav.Link>
           <Nav.Link as={Link} className="hover-black" to="/booking-history">Booking History</Nav.Link>
           <Nav.Link as={Link} className="hover-black" to="/submit-issue">Submit Issue</Nav.Link>
           <Nav.Link as={Link} className="hover-black" to="/discounts">Discounts</Nav.Link>
           <Nav.Link as={Link} className="hover-black" to="/settings">Settings</Nav.Link>
       </Nav>
   );
}