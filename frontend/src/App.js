import React from "react";
import {Outlet, useNavigate} from 'react-router-dom';
import host from './host';
import Cookies from 'universal-cookie';
import 'react-notifications/lib/notifications.css';
import {NotificationContainer} from 'react-notifications';
import './App.css';

const App = () => {
    const cookies = new Cookies();
    let navigate = useNavigate();

    async function signOut() {
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
        cookies.remove('accessToken');
        cookies.remove('accountID');
        cookies.remove('accountRole');
        cookies.remove('accountName');
        navigate('/');
    }

    return (
        <div id="wrapper">
            <Outlet context={[signOut]}/>
            <NotificationContainer className="custom-notification"/>
        </div>
    );
};

export default App;