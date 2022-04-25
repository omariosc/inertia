import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App';
import LandingPage from "./LandingPage";
import CustomerInterface from "./customer/CustomerInterface";
import CustomerCreateBooking from "./customer/CustomerCreateBooking";
import CustomerCurrentBookings from "./customer/CustomerCurrentBooking";
import CustomerBookingHistory from "./customer/CustomerBookingHistory";
import CustomerSubmitIssue from "./customer/CustomerSubmitIssue";
import CustomerDiscounts from "./customer/CustomerDiscounts";
import CustomerSettings from "./customer/CustomerSettings";
import EmployeeInterface from "./staff/employee/EmployeeInterface";
import EmployeeCreateGuestBooking from "./staff/employee/EmployeeCreateBooking";
import EmployeeBookingApplications from "./staff/employee/EmployeeBookingApplications";
import EmployeeOngoingBookings from "./staff/employee/EmployeeOngoingBookings";
import EmployeeBookingHistory from "./staff/employee/EmployeeBookingHistory";
import EmployeeScooterManagement from "./staff/employee/EmployeeScooterManagement";
import EmployeeSubmitIssue from "./staff/employee/EmployeeSubmitIssues";
import EmployeeManageIssues from "./staff/employee/EmployeeManageIssues";
import EmployeeDiscountApplications from "./staff/employee/EmployeeDiscountApplications";
import Dashboard from "./staff/StaffDashboard";
import StaffViewIssue from "./staff/StaffViewIssue";
import StaffSettings from "./staff/StaffSettings";
import ManagerInterface from "./staff/manager/ManagerInterface";
import ManagerScooterManagement from "./staff/manager/ManagerScooterManagement";
import ManagerHireOptionManagement from "./staff/manager/ManagerHireOptionManagement";
import ManagerDepotManagement from "./staff/manager/ManagerDepotManagement";
import ManagerIssues from "./staff/manager/ManagerIssues";
import ManagerStatistics from "./staff/manager/ManagerStatistics";
import ManagerAccountManagement from "./staff/manager/ManagerAccountManagement";
import Cookies from "universal-cookie";
import './App.css'
import './index.css';

const cookies = new Cookies();

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}>
                    {(cookies.get('accountRole') === "1") ?
                        <Route path="" element={<EmployeeInterface/>}>
                            <Route path="dashboard" element={<Dashboard/>}/>
                            <Route path="create-guest-booking" element={<EmployeeCreateGuestBooking/>}/>
                            <Route path="booking-applications" element={<EmployeeBookingApplications/>}/>
                            <Route path="bookings" element={<EmployeeOngoingBookings/>}/>
                            <Route path="booking-history" element={<EmployeeBookingHistory/>}/>
                            <Route path="scooter-management" element={<EmployeeScooterManagement/>}/>
                            <Route path="submit-issue" element={<EmployeeSubmitIssue/>}/>
                            <Route path="issues" element={<EmployeeManageIssues/>}/>
                            <Route path="issues/:id" element={<StaffViewIssue/>}/>
                            <Route path="discount-applications" element={<EmployeeDiscountApplications/>}/>
                            <Route path="settings" element={<StaffSettings/>}/>
                            <Route path="*" element={<Dashboard/>}/>
                        </Route> : null
                    }
                    {(cookies.get('accountRole') === "2") ?
                        <Route path="" element={<ManagerInterface/>}>
                            <Route path="dashboard" element={<Dashboard/>}/>
                            <Route path="scooter-management" element={<ManagerScooterManagement/>}/>
                            <Route path="hire-option-management" element={<ManagerHireOptionManagement/>}/>
                            <Route path="depot-management" element={<ManagerDepotManagement/>}/>
                            <Route path="issues" element={<ManagerIssues/>}/>
                            <Route path="statistics" element={<ManagerStatistics/>}/>
                            <Route path="account-management" element={<ManagerAccountManagement/>}/>
                            <Route path="settings" element={<StaffSettings/>}/>
                            <Route path="*" element={<Dashboard/>}/>
                        </Route> : null
                    }
                    {(cookies.get('accountRole') === "0") ?
                        <Route path="" element={<CustomerInterface/>}>
                            <Route path="create-booking" element={<CustomerCreateBooking/>}/>
                            <Route path="current-bookings" element={<CustomerCurrentBookings/>}/>
                            <Route path="booking-history" element={<CustomerBookingHistory/>}/>
                            <Route path="submit-issue" element={<CustomerSubmitIssue/>}/>
                            <Route path="discounts" element={<CustomerDiscounts/>}/>
                            <Route path="settings" element={<CustomerSettings/>}/>
                            <Route path="*" element={<CustomerCreateBooking/>}/>
                        </Route> : null
                    }
                    <Route index element={<LandingPage/>}/>
                    <Route path="*" element={<LandingPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
