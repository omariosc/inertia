/*
	Purpose of file: Tests the default manager navbar
*/

import React from 'react';
import ReactDOM from 'react-dom';
import ManagerNavigation from "../staff/manager/ManagerNavigation";
import {BrowserRouter} from "react-router-dom";
import {AccountProvider} from "../authorize";

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <BrowserRouter>
            <AccountProvider>
                <ManagerNavigation/>
            </AccountProvider>
        </BrowserRouter>
        , div);
});