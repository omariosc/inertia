/* Purpose of file: Test date formatting component */

import showDate from '../showDate';

it('converts dates properly', () => {
  expect(showDate('2005-12-21T15:45:23').replace(' at', ',')).
      toEqual('December 21, 2005, 3:45:23 PM');
  expect(showDate('1997-03-18T03:11:02').replace(' at', ',')).
      toEqual('March 18, 1997, 3:11:02 AM');
});
