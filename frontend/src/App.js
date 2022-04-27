import React from "react";
import {Outlet} from 'react-router-dom';
import host from './host';
import Cookies from 'universal-cookie';
import {NotificationContainer} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './App.css';

const App = () => {
    const cookies = new Cookies();

    // Signs out from application. Deletes cookies and navigates to landing page.
    async function signOut() {
        cookies.remove('accountRole');
        cookies.remove('accessToken');
        cookies.remove('accountID');
        cookies.remove('accountName');
        try {
            await fetch(host + 'api/Users/authorize', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${cookies.get('accessToken')}`
                },
                body: JSON.stringify({
                    'accessToken': cookies.get('accessToken')
                }),
                mode: "cors"
            });
        } catch (error) {
            console.error(error);
        }
        window.location.reload(true);
    }

    // Outlet with context (to pass signOut function) enclosed in wrapper.
    return (
        <div id="wrapper">
            <Outlet context={[signOut]}/>
            <NotificationContainer className="custom-notification"/>
        </div>
    );
};

export default App;