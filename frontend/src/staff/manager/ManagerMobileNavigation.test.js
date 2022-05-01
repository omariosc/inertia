/*
	Purpose of file: Test the manager mobile navbar component
*/

import React from 'react';
import ReactDOM from 'react-dom';
import ManagerMobileNavigation from "./ManagerMobileNavigation";
import {BrowserRouter} from "react-router-dom";
import {AccountProvider} from "../../authorize";

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <BrowserRouter>
            <AccountProvider>
                <ManagerMobileNavigation/>
            </AccountProvider>
        </BrowserRouter>
        , div);
});