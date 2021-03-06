/* Purpose of file: Allows a user to either sign in or out of their account */

import Cookies from 'universal-cookie';
import host from './host';
import {createContext, useContext, useMemo, useState} from 'react';

/**
 * Class to store the user account details
 */
export class Account {
  /**
   * Sets account details
   * @param {string} name
   * @param {string} role
   * @param {number} id
   * @param {string} accessToken
   */
  constructor(name, role, id, accessToken) {
    this.name = name;
    this.role = role;
    this.id = id;
    this.accessToken = accessToken;
  }
}

/**
 * Signs a user out of their account and deletes their access
 * token from the backend server
 *
 * @param {function} setAccount
 * @param {boolean} callback
 */
export function signOut(setAccount, callback) {
  const cookies = new Cookies();

  try {
    fetch(host + 'api/Users/authorize', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${cookies.get('accessToken')}`,
      },
      body: JSON.stringify({
        'accessToken': cookies.get('accessToken'),
      }),
      mode: 'cors',
    }).then(() => {
      cookies.remove('accountRole');
      cookies.remove('accessToken');
      cookies.remove('accountID');
      cookies.remove('accountName');
      setAccount(null);
      if (callback) {
        callback('signout success');
      }
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * Signs a user into their account and gets the new access
 * token from the backend server. Stores user information in
 * local cookies
 *
 * @param {function} setAccount
 * @param {string} email
 * @param {string} password
 * @param {boolean} callback
 */
export function signIn(setAccount, email, password, callback) {
  const cookies = new Cookies();

  try {
    fetch(host + 'api/Users/authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        'email': email,
        'password': password,
      }),
      mode: 'cors',
    }).then((r) => {
      r.json().then((response) => {
        if (response.accessToken) {
          // Sets user cookies.
          cookies.set('accountID', response.account.accountId, {path: '/'});
          cookies.set('accountName', response.account.name, {path: '/'});
          cookies.set('accountRole', response.account.role, {path: '/'});
          cookies.set('accessToken', response.accessToken, {path: '/'});

          const account = new Account(
              response.account.name,
              String(response.account.role),
              response.account.accountId,
              response.accessToken,
          );

          setAccount(account);

          if (callback) {
            callback('login success', account);
          }
        } else {
          if (callback) {
            callback('login error', null);
          }
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * Returns account information from local cookies, if the
 * information exists
 * @return {Account} New account from cookie storage
 */
export function accountFromCookies() {
  const cookies = new Cookies();

  const accountRole = cookies.get('accountRole');
  const accountName = cookies.get('accountName');
  const accountToken = cookies.get('accessToken');
  const accountID = cookies.get('accountID');

  if (
    accountRole == null ||
      accountName == null ||
      accountToken == null ||
      accountID == null
  ) {
    return null;
  }

  return new Account(
      accountName,
      accountRole,
      accountID,
      accountToken,
  );
}

const AccountContext = createContext(null);

// eslint-disable-next-line valid-jsdoc
/**
 * Hook to access the global account context
 * @return The global account context
 */
export function useAccount() {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error(`useAccount must be used within an AccountProvider`);
  }

  return context;
}

// eslint-disable-next-line valid-jsdoc
/**
 * Provider for global account context
 * @param {ReactPropTypes} props
 * @return Provider component for global account context
 */
export function AccountProvider(props) {
  const [account, setAccount] = useState(accountFromCookies());
  const value = useMemo(() => [
    account,
    (callback) => signOut(setAccount, callback),
    (email, password, callback) => signIn(setAccount, email, password,
        callback),
  ], [account]);
  // eslint-disable-next-line react/react-in-jsx-scope
  return <AccountContext.Provider value={value} {...props} />;
}
