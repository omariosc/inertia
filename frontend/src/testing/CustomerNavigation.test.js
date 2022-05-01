/* Purpose of file: Tests the default customer navbar component */

import React from 'react';
import ReactDOM from 'react-dom';
import CustomerNavigation from '../customer/CustomerNavigation';
import {BrowserRouter} from 'react-router-dom';
import {AccountProvider} from '../authorize';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
      <BrowserRouter>
        <AccountProvider>
          <CustomerNavigation/>
        </AccountProvider>
      </BrowserRouter>
      , div);
});
