/*
	Purpose of file: Test employee navbar component
*/

import React from 'react';
import ReactDOM from 'react-dom';
import EmployeeNavigation from "../staff/employee/EmployeeNavigation";
import {BrowserRouter} from "react-router-dom";
import {AccountProvider} from "../authorize";

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <BrowserRouter>
            <AccountProvider>
                <EmployeeNavigation/>
            </AccountProvider>
        </BrowserRouter>
        , div);
});