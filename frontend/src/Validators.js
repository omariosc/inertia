/*  Purpose of file: Validators for registration, checks that supplied name,
email, password are in correct format. */

import {NotificationManager} from 'react-notifications';

/**
 * Checks format of name, email and both passwords
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {string} confirmPassword
 * @return {int} 0 if any of the validations fail, 1 otherwise
 */
export default function validate(name, email, password, confirmPassword) {
  const validateName = (str) => {
    return (str.length > 0);
  };

  const validatePassword = (str) => {
    return str.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    );
  };

  const validateEmail = (str) => {
    return str.match(
        // eslint-disable-next-line max-len
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
  };

  if (!validateName(name)) {
    NotificationManager.error('Please enter your full name.', 'Error');
    return 0;
  }
  if (!validateEmail(email)) {
    NotificationManager.error('Please enter a valid email address.', 'Error');
    return 0;
  }
  if (password !== confirmPassword) {
    NotificationManager.error('Passwords do not match.', 'Error');
    return 0;
  }
  if (!validatePassword(password)) {
    NotificationManager.error(
        // eslint-disable-next-line max-len
        'Please enter a valid password. Passwords should contain minimum eight characters, ' +
        // eslint-disable-next-line max-len
        'at least one uppercase letter, one lowercase letter, one number and one special character.',
        'Error');
    return 0;
  }
  return 1;
};
