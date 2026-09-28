import { adultSessionSnapshot, noteAdultSession } from '../adult-session';

test('a noted sign-in is visible on the next read', () => {
  noteAdultSession(true);
  const first = adultSessionSnapshot();
  noteAdultSession(true);
  expect(adultSessionSnapshot()).toBe(first);
  expect(first).toEqual({ ready: true, signedIn: true });
  noteAdultSession(false);
  expect(adultSessionSnapshot()).toEqual({ ready: true, signedIn: false });
});
