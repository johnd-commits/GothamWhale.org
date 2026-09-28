import {
  registerAdult,
  saveNewPassword,
  sendPasswordReset,
  signInAdult,
  signupIsExistingAccount,
  type AdultAuth,
} from '../adult-account';
import { chooseActiveChild, deleteChildFromSnapshot, type ChildDataSnapshot } from '../child-records';
import { placeholderConsentProvider } from '../consent';
import { hashPin, isFourDigitPin, pinMatches } from '../pin';
import { sha256Hex } from '../sha256';

const childId = 'child-1';
const otherChildId = 'child-2';

function snapshot(): ChildDataSnapshot {
  return {
    profiles: [
      { id: childId, nickname: 'Splash', avatar: 'humpback', ageBand: '7-8' },
      { id: otherChildId, nickname: 'Kelp', avatar: 'fluke', ageBand: '9-10' },
    ],
    follows: [
      { childId },
      { childId: otherChildId },
    ],
    badges: [{ childId }, { childId: otherChildId }],
    questCompletions: [{ childId }, { childId: otherChildId }],
    dexEntries: [
      { childId },
      { childId: null },
    ],
    classMembers: [{ childId }, { childId: otherChildId }],
  };
}

test('sha256 matches the known digest for a four-digit PIN', () => {
  expect(sha256Hex('1234')).toBe('03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4');
});

test('a grown-up PIN is four digits and is stored as a hash', () => {
  expect(isFourDigitPin('1234')).toBe(true);
  expect(isFourDigitPin('12345')).toBe(false);
  expect(isFourDigitPin('12a4')).toBe(false);
  const stored = hashPin('1234');
  expect(stored).not.toBe('1234');
  expect(pinMatches('1234', stored ?? '')).toBe(true);
  expect(pinMatches('9999', stored ?? '')).toBe(false);
});

test('the placeholder consent records a grant only after the notice is accepted', async () => {
  const now = new Date('2026-09-27T16:00:00.000Z');
  await expect(placeholderConsentProvider.requestConsent(false, now)).resolves.toBeNull();
  await expect(placeholderConsentProvider.requestConsent(true, now)).resolves.toEqual({
    status: 'granted',
    consentedAt: '2026-09-27T16:00:00.000Z',
  });
});

test('sign-up does not create an account until the notice is accepted', async () => {
  const auth = fakeAuth();
  const result = await registerAdult(auth, {
    email: 'parent@example.com',
    password: 'harbor-day',
    acceptedNotice: false,
  });
  expect(result.status).toBe('need-consent');
  expect(auth.signUp).not.toHaveBeenCalled();
});

test('an empty identity list means this email already has an account', () => {
  expect(signupIsExistingAccount([])).toBe(true);
  expect(signupIsExistingAccount([{ id: 'identity-1' }])).toBe(false);
  expect(signupIsExistingAccount(undefined)).toBe(false);
});

test('creating an account that already exists tells the grown-up to sign in', async () => {
  const auth = fakeAuth();
  auth.signUp.mockResolvedValue({
    userId: 'adult-1',
    hasSession: false,
    alreadyRegistered: true,
    error: null,
  });
  const result = await registerAdult(auth, {
    email: 'parent@example.com',
    password: 'harbor-day',
    acceptedNotice: true,
  });
  expect(result).toEqual({
    status: 'error',
    message: 'That email already has an account. Sign in instead.',
  });
  expect(auth.insertAdult).not.toHaveBeenCalled();
});

test('sign-in says when another confirmation link was sent', async () => {
  const auth = fakeAuth();
  auth.signIn.mockResolvedValue({ userId: null, error: null, confirmationSent: true });
  const result = await signInAdult(auth, {
    email: 'parent@example.com',
    password: 'harbor-day',
    acceptedNotice: true,
  });
  expect(result).toEqual({
    status: 'error',
    message: 'I sent another confirmation link. Check your inbox and spam.',
  });
});

test('create account asks for the same password twice', async () => {
  const auth = fakeAuth();
  const result = await registerAdult(auth, {
    email: 'parent@example.com',
    password: 'harbor-day',
    passwordAgain: 'harbor-night',
    acceptedNotice: true,
  });
  expect(result).toEqual({
    status: 'error',
    message: 'Enter the same password in both boxes.',
  });
  expect(auth.signUp).not.toHaveBeenCalled();
});

test('a password that does not match points to reset', async () => {
  const auth = fakeAuth();
  auth.signIn.mockResolvedValue({ userId: null, error: 'Invalid login credentials' });
  const result = await signInAdult(auth, {
    email: 'parent@example.com',
    password: 'harbor-day',
    acceptedNotice: true,
  });
  expect(result).toEqual({
    status: 'error',
    message: 'That email and password do not match. Use Forgot password to set a new one.',
  });
});

test('password reset needs a real email and a matching new password', async () => {
  const auth = fakeAuth();
  await expect(sendPasswordReset(auth, 'not-an-email')).resolves.toEqual({
    status: 'error',
    message: 'Use the email for this account.',
  });
  expect(auth.requestPasswordReset).not.toHaveBeenCalled();
  await expect(saveNewPassword(auth, 'harbor-day', 'harbor-night')).resolves.toEqual({
    status: 'error',
    message: 'Enter the same password in both boxes.',
  });
  expect(auth.updatePassword).not.toHaveBeenCalled();
  await expect(saveNewPassword(auth, 'harbor-day', 'harbor-day')).resolves.toEqual({ status: 'saved' });
});

test('sign-up stores consent when the session is ready', async () => {
  const auth = fakeAuth();
  const result = await registerAdult(auth, {
    email: 'parent@example.com',
    password: 'harbor-day',
    acceptedNotice: true,
  });
  expect(result).toEqual({ status: 'ready', adultId: 'adult-1' });
  expect(auth.insertAdult).toHaveBeenCalledWith(
    'adult-1',
    expect.objectContaining({ status: 'granted' }),
  );
});

test('sign-in asks for consent before the first adult row is saved', async () => {
  const auth = fakeAuth({ hasRow: false });
  const blocked = await signInAdult(auth, {
    email: 'parent@example.com',
    password: 'harbor-day',
    acceptedNotice: false,
  });
  expect(blocked.status).toBe('need-consent');
  expect(auth.insertAdult).not.toHaveBeenCalled();
});

test('deleting a child removes that child from every child table and leaves the other family', () => {
  const next = deleteChildFromSnapshot(snapshot(), childId);
  expect(next.profiles.map((profile) => profile.id)).toEqual([otherChildId]);
  expect(next.follows).toEqual([{ childId: otherChildId }]);
  expect(next.badges).toEqual([{ childId: otherChildId }]);
  expect(next.questCompletions).toEqual([{ childId: otherChildId }]);
  expect(next.classMembers).toEqual([{ childId: otherChildId }]);
  expect(next.dexEntries).toEqual([{ childId: null }]);
});

test('kids can switch profiles without a new login', () => {
  expect(chooseActiveChild([childId, otherChildId], otherChildId)).toBe(otherChildId);
  expect(chooseActiveChild([childId], null)).toBe(childId);
  expect(chooseActiveChild([childId, otherChildId], null)).toBeNull();
});

function fakeAuth(options?: { hasRow?: boolean }): AdultAuth & {
  signUp: jest.Mock;
  signIn: jest.Mock;
  insertAdult: jest.Mock;
  requestPasswordReset: jest.Mock;
  updatePassword: jest.Mock;
} {
  return {
    signUp: jest.fn(async () => ({
      userId: 'adult-1',
      hasSession: true,
      alreadyRegistered: false,
      error: null,
    })),
    signIn: jest.fn(async () => ({ userId: 'adult-1', error: null })),
    requestPasswordReset: jest.fn(async () => ({ error: null })),
    updatePassword: jest.fn(async () => ({ error: null })),
    hasAdultRow: jest.fn(async () => options?.hasRow ?? true),
    insertAdult: jest.fn(async () => null),
    listChildren: jest.fn(async () => []),
    insertChild: jest.fn(async () => ({ profile: null, error: null })),
    deleteChild: jest.fn(async () => null),
  };
}
