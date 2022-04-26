import React from "react";
import {Outlet, useNavigate} from 'react-router-dom';
import host from './host';
import Cookies from 'universal-cookie';
import './App.css';

const App = () => {
    const cookies = new Cookies();
    let navigate = useNavigate();

    // Signs out from application. Deletes cookies and navigates to landing page.
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

    // Outlet with context (to pass signOut function) enclosed in wrapper.
    return (
        <div id="wrapper">
            <Outlet context={[signOut]}/>
        </div>
    );
};

export default App;