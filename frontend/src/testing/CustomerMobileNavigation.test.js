/* Purpose of file: Tests the customer mobile navbar component */

import React from 'react';
import ReactDOM from 'react-dom';
import CustomerMobileNavigation from '../customer/CustomerMobileNavigation';
import {BrowserRouter} from 'react-router-dom';
import {AccountProvider} from '../authorize';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
      <BrowserRouter>
        <AccountProvider>
          <CustomerMobileNavigation/>
        </AccountProvider>
      </BrowserRouter>
      , div);
});
