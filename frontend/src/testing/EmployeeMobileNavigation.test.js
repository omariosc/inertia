/* Purpose of file: Test employee mobile navbar component */

import React from 'react';
import ReactDOM from 'react-dom';
import EmployeeMobileNavigation
  from '../staff/employee/EmployeeMobileNavigation';
import {BrowserRouter} from 'react-router-dom';
import {AccountProvider} from '../authorize';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
      <BrowserRouter>
        <AccountProvider>
          <EmployeeMobileNavigation/>
        </AccountProvider>
      </BrowserRouter>
      , div);
});
