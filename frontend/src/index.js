import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";

const stripePromise = loadStripe('pk_test_51KflboBY5x162kEqzQbrGMfhJhM9E27Nl8JMNj83EwyzSRyK95KwigopchuGoDDh4uLaee8lgikwoDRfqeDxdYmJ00R5OJZVaw');

ReactDOM.render(
    <React.StrictMode>
        <Elements stripe={stripePromise}>
            <App/>
        </Elements>
    </React.StrictMode>,
    document.getElementById('root')
);
