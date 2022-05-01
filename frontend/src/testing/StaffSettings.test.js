/* Purpose of file: Tests the staff settings component */

import React from 'react';
import ReactDOM from 'react-dom';
import StaffSettings from '../staff/StaffSettings';
import {BrowserRouter} from 'react-router-dom';
import {AccountProvider} from '../authorize';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
      <BrowserRouter>
        <AccountProvider>
          <StaffSettings/>
        </AccountProvider>
      </BrowserRouter>
      , div);
});
