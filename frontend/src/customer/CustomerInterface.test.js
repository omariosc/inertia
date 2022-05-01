/*
	Purpose of file: Tests the customer interface component
*/

import React from 'react';
import ReactDOM from 'react-dom';
import CustomerInterface from "./CustomerInterface";
import {BrowserRouter} from "react-router-dom";
import {AccountProvider} from "../authorize";

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <BrowserRouter>
            <AccountProvider>
                <CustomerInterface/>
            </AccountProvider>
        </BrowserRouter>
        , div);
});