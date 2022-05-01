/* Purpose of file: Test payment component on main page */

import React from 'react';
import ReactDOM from 'react-dom';
import MainPayment from '../components/main-page-content/mainPayment';
import {BrowserRouter} from 'react-router-dom';
import {AccountProvider} from '../authorize';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
      <BrowserRouter>
        <AccountProvider>
          <MainPayment/>
        </AccountProvider>
      </BrowserRouter>
      , div);
});
