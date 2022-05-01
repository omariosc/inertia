import React from 'react';
import ReactDOM from 'react-dom';
import LoginForm from "./Login";
import {BrowserRouter} from "react-router-dom";
import {AccountProvider} from "./authorize";

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
        <BrowserRouter>
            <AccountProvider>
                <LoginForm/>
            </AccountProvider>
        </BrowserRouter>
        , div);
});