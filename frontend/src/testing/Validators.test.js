/* Purpose of file: Tests validation component */

import validate from '../Validators';

it('returns 0 for invalid name', () => {
  expect(validate('', 'bat@gmail.com', 'Stringy3353?', 'Stringy3353?')).
      toEqual(0);
});

it('returns 0 for invalid password', () => {
  expect(
      validate('Jimmmy McGill', 'jgill@gmail.com', 'chicanery', 'chicanery')).
      toEqual(0);
  expect(validate('Jack Frost', 'jfrost@gmail.com', 'Chills45', 'Chills45')).
      toEqual(0);
  expect(
      validate('Jane Eyre', 'jeyre@gmail.com', 'brontte1847!', 'brontte1847!')).
      toEqual(0);
});

it('returns 0 for invalid email', () => {
  expect(validate('Jimmmy McGill', 'jgill', 'Chicanery001&', 'Chicanery001&')).
      toEqual(0);
  expect(validate('Jack Frost', 'jfrost@gmail', 'Chills45$', 'Chills45$')).
      toEqual(0);
});

it('returns 0 for incorrect confirm password', () => {
  expect(validate('Jimmmy McGill', 'jgill@gmail.com', 'Chicanery001&',
      'Chicanery001')).toEqual(0);
  expect(validate('Jack Frost', 'jfrost@gmail.com', 'Chills45$', 'Chill45$')).
      toEqual(0);
});

it('returns 1 for correct details', () => {
  expect(validate('John Carter', 'jcarter@gmail.com', 'LifeOnMars2030?',
      'LifeOnMars2030?')).toEqual(1);
});


