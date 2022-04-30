import React, {useState} from "react";
import {Outlet, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import Cookies from 'universal-cookie';
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './App.css';
import EmployeeInterface from "./staff/employee/EmployeeInterface";
import Dashboard from "./staff/StaffDashboard";
import EmployeeCreateGuestBooking from "./staff/employee/EmployeeCreateBooking";
import EmployeeBookingApplications from "./staff/employee/EmployeeBookingApplications";
import EmployeeOngoingBookings from "./staff/employee/EmployeeOngoingBookings";
import EmployeeBookingHistory from "./staff/employee/EmployeeBookingHistory";
import EmployeeViewBooking from "./staff/employee/EmployeeViewBooking";
import EmployeeScooterManagement from "./staff/employee/EmployeeScooterManagement";
import EmployeeSubmitIssue from "./staff/employee/EmployeeSubmitIssues";
import StaffManageIssues from "./staff/StaffManageIssues";
import StaffViewIssue from "./staff/StaffViewIssue";
import EmployeeDiscountApplications from "./staff/employee/EmployeeDiscountApplications";
import StaffSettings from "./staff/StaffSettings";
import ManagerInterface from "./staff/manager/ManagerInterface";
import ManagerScooterManagement from "./staff/manager/ManagerScooterManagement";
import ManagerHireOptionManagement from "./staff/manager/ManagerHireOptionManagement";
import ManagerDepotManagement from "./staff/manager/ManagerDepotManagement";
import ManagerStatistics from "./staff/manager/ManagerStatistics";
import ManagerAccountManagement from "./staff/manager/ManagerAccountManagement";
import CustomerInterface from "./customer/CustomerInterface";
import CustomerCreateBooking from "./customer/CustomerCreateBooking";
import CustomerCurrentBookings from "./customer/CustomerCurrentBooking";
import CustomerBookingHistory from "./customer/CustomerBookingHistory";
import CustomerSubmitIssue from "./customer/CustomerSubmitIssue";
import CustomerDiscounts from "./customer/CustomerDiscounts";
import CustomerSettings from "./customer/CustomerSettings";
import MainPage from "./MainPage";
import LoginForm from "./Login";
import RegisterForm from "./Register";
import DepotList from "./components/main-page-content/DepotList";
import Booking from "./components/main-page-content/Booking";
import DepotEntry from "./components/main-page-content/DepotEntry";

import {Account, AccountProvider, signIn, signOut} from './authorize';

const App = () => {
    const cookies = new Cookies();
    const navigate = useNavigate();
    const location = useLocation();
    const statefulBackgroundLocation = location.state;

    // Outlet with context (to pass signOut function) enclosed in wrapper.
    return (
        <AccountProvider>
            <Routes location={statefulBackgroundLocation !== null ? statefulBackgroundLocation : location}>
                <Route path="/" element={
                    <div id="wrapper">
                        <Outlet/>
                        <NotificationContainer className="custom-notification"/>
                    </div>}>
                    {/* Employee Routes */}
                    {(cookies.get('accountRole') === "1") &&
                        <Route element={<EmployeeInterface/>}>
                            <Route path="dashboard" element={<Dashboard/>}/>
                            <Route path="create-guest-booking" element={<EmployeeCreateGuestBooking/>}/>
                            <Route path="booking-applications" element={<EmployeeBookingApplications/>}/>
                            <Route path="bookings" element={<EmployeeOngoingBookings/>}/>
                            <Route path="booking-history" element={<EmployeeBookingHistory/>}/>
                            <Route path="bookings/:orderId/" element={<EmployeeViewBooking/>}/>
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
                        <Route element={<ManagerInterface/>}>
                            <Route path="dashboard" element={<Dashboard/>}/>
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
                            <Route path="current-bookings" element={<CustomerCurrentBookings/>}/>
                            <Route path="booking-history" element={<CustomerBookingHistory/>}/>
                            <Route path="submit-issue" element={<CustomerSubmitIssue/>}/>
                            <Route path="discounts" element={<CustomerDiscounts/>}/>
                            <Route path="settings" element={<CustomerSettings/>}/>
                            <Route path="*" element={<CustomerCreateBooking/>}/>
                        </Route>
                    }
                    { /* base case for login and signup modals */ }
                    <Route path={"/login"} element={
                        <>
                            <MainPage/>
                            <LoginForm show={true} onHide={() => navigate('/')}/>
                        </>
                    } />
                    <Route path={"/signup"} element={
                        <>
                            <MainPage/>
                            <RegisterForm show={true} onHide={() => navigate('/')}/>
                        </>
                    } />

                    {/* Main page routing */}
                    <Route element={<MainPage/>}>
                        <Route path="booking/:depoId/" element={<Booking />}/>
                        <Route path="depots/:depoId" element={<DepotEntry />}/>
                        <Route path="depots" element={<DepotList />}/>
                        <Route index element={<DepotList/>}/>
                        <Route path="*" element={<DepotList/>}/>
                    </Route>
                </Route>
            </Routes>

            {statefulBackgroundLocation !== null && (
                <Routes>
                    <Route path={"/login"} element={<LoginForm show={true} onHide={() => navigate(-1)}/>} />
                    <Route path={"/signup"} element={<RegisterForm show={true} onHide={() => navigate(-1)}/>} />
                </Routes>
            )}
        </AccountProvider>
    );
};

export default App;