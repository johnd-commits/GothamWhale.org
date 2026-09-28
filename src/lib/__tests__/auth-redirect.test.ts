import { emailConfirmationRedirect, passwordResetRedirect } from '../auth-redirect';

test('sends the confirmation link back to this website', () => {
  expect(emailConfirmationRedirect('https://gotham-whale-org.vercel.app')).toBe(
    'https://gotham-whale-org.vercel.app/signup',
  );
  expect(emailConfirmationRedirect('https://gotham-whale-org.vercel.app/add-child')).toBe(
    'https://gotham-whale-org.vercel.app/signup',
  );
});

test('sends a password reset back to this website', () => {
  expect(passwordResetRedirect('https://gotham-whale-org.vercel.app/signup')).toBe(
    'https://gotham-whale-org.vercel.app/reset-password',
  );
});

test('ignores a missing or unsafe address', () => {
  expect(emailConfirmationRedirect(undefined)).toBeUndefined();
  expect(emailConfirmationRedirect('not a url')).toBeUndefined();
  expect(emailConfirmationRedirect('javascript:alert(1)')).toBeUndefined();
});
