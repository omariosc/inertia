import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App';
import LandingPage from "./LandingPage";
import CustomerInterface from "./customer/CustomerInterface";
import CustomerCreateBooking from "./customer/CustomerCreateBooking";
import CustomerCreateExtension from "./customer/CustomerCreateExtension";
import CustomerCancelBooking from "./customer/CustomerCancelBooking";
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
import EmployeeCancelBooking from "./staff/employee/EmployeeCancelBooking";
import EmployeeExtendGuestBooking from "./staff/employee/EmployeeExtendBooking";
import EmployeeViewBooking from "./staff/employee/EmployeeViewBooking";
import EmployeeScooterManagement from "./staff/employee/EmployeeScooterManagement";
import EmployeeSubmitIssue from "./staff/employee/EmployeeSubmitIssues";
import EmployeeDiscountApplications from "./staff/employee/EmployeeDiscountApplications";
import Dashboard from "./staff/StaffDashboard";
import StaffViewIssue from "./staff/StaffViewIssue";
import StaffManageIssues from "./staff/StaffManageIssues";
import StaffSettings from "./staff/StaffSettings";
import ManagerInterface from "./staff/manager/ManagerInterface";
import ManagerScooterManagement from "./staff/manager/ManagerScooterManagement";
import ManagerHireOptionManagement from "./staff/manager/ManagerHireOptionManagement";
import ManagerDepotManagement from "./staff/manager/ManagerDepotManagement";
import ManagerStatistics from "./staff/manager/ManagerStatistics";
import ManagerAccountManagement from "./staff/manager/ManagerAccountManagement";
import Cookies from "universal-cookie";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js"
import './App.css'
import './index.css';

const cookies = new Cookies();

// Creates all routes for the user.
ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}>
                    {/* Employee Routes */}
                    {(cookies.get('accountRole') === "1") &&
                        <Route path="" element={<EmployeeInterface/>}>
                            <Route path="home" element={<Dashboard/>}/>
                            <Route index element={<Dashboard/>}/>
                            <Route path="create-guest-booking" element={<EmployeeCreateGuestBooking/>}/>
                            <Route path="booking-applications" element={<EmployeeBookingApplications/>}/>
                            <Route path="bookings" element={<EmployeeOngoingBookings/>}/>
                            <Route path="booking-history" element={<EmployeeBookingHistory/>}/>
                            <Route path="bookings/:orderId/" element={<EmployeeViewBooking/>}/>
                            <Route path="bookings/extend/:orderId/" element={<EmployeeExtendGuestBooking/>}/>
                            <Route path="bookings/cancel/:orderId/" element={<EmployeeCancelBooking/>}/>
                            <Route path="scooter-management" element={<EmployeeScooterManagement/>}/>
                            <Route path="submit-issue" element={<EmployeeSubmitIssue/>}/>
                            <Route path="issues" element={<StaffManageIssues/>}/>
                            <Route path="issues/:id" element={<StaffViewIssue/>}/>
                            <Route path="discount-applications" element={<EmployeeDiscountApplications/>}/>
                            <Route path="settings" element={<StaffSettings/>}/>
                            <Route path="*" element={<Dashboard/>}/>
                        </Route>
                    }
                    {/* Manager Routes */}
                    {(cookies.get('accountRole') === "2") &&
                        <Route path="" element={<ManagerInterface/>}>
                            <Route path="dashboard" element={<Dashboard/>}/>
                            <Route index element={<Dashboard/>}/>
                            <Route path="scooter-management" element={<ManagerScooterManagement/>}/>
                            <Route path="hire-option-management" element={<ManagerHireOptionManagement/>}/>
                            <Route path="depot-management" element={<ManagerDepotManagement/>}/>
                            <Route path="issues" element={<StaffManageIssues manager={true}/>}/>
                            <Route path="issues/:id" element={<StaffViewIssue/>}/>
                            <Route path="statistics" element={<ManagerStatistics/>}/>
                            <Route path="account-management" element={<ManagerAccountManagement/>}/>
                            <Route path="settings" element={<StaffSettings/>}/>
                            <Route path="*" element={<Dashboard/>}/>
                        </Route>
                    }
                    {/* Customer Routes */}
                    {(cookies.get('accountRole') === "0") &&
                        <Route path="" element={<CustomerInterface/>}>
                            <Route path="create-booking" element={<CustomerCreateBooking/>}/>
                            <Route index element={<CustomerCreateBooking/>}/>
                            <Route path="current-bookings" element={<CustomerCurrentBookings/>}/>
                            <Route path="booking/extend/:orderId" element={<CustomerCreateExtension/>}/>
                            <Route path="booking/cancel/:orderId" element={<CustomerCancelBooking/>}/>
                            <Route path="booking-history" element={<CustomerBookingHistory/>}/>
                            <Route path="submit-issue" element={<CustomerSubmitIssue/>}/>
                            <Route path="discounts" element={<CustomerDiscounts/>}/>
                            <Route path="settings" element={<CustomerSettings/>}/>
                            <Route path="*" element={<CustomerCreateBooking/>}/>
                        </Route>
                    }
                    {/* Non-Logged In Users Routes */}
                    <Route index element={<LandingPage/>}/>
                    <Route path="*" element={<LandingPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
