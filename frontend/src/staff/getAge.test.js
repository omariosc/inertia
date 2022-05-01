import getAge from "./getAge";

it('returns correct time elapsed since order was created', () => {
   expect(getAge(Date.now() - 173000000)).toEqual('2 days');
   expect(getAge(Date.now() - 10800000)).toEqual('3 hours');
   expect(getAge(Date.now() - 300000)).toEqual('5 minutes');
   expect(getAge(Date.now() - 2)).toEqual('less than a minute');
});