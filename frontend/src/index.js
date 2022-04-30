import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js"
import './App.css'
import './index.css';
import {BrowserRouter} from "react-router-dom";
import {AccountProvider} from "./authorize";


// Creates all routes for the user.
ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <AccountProvider>
                <App/>
            </AccountProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
