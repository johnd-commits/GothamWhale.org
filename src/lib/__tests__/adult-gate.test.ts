import { registerAdult, signInAdult, type AdultAuth } from '../adult-account';
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
  insertAdult: jest.Mock;
} {
  return {
    signUp: jest.fn(async () => ({ userId: 'adult-1', hasSession: true, error: null })),
    signIn: jest.fn(async () => ({ userId: 'adult-1', error: null })),
    hasAdultRow: jest.fn(async () => options?.hasRow ?? true),
    insertAdult: jest.fn(async () => null),
    listChildren: jest.fn(async () => []),
    insertChild: jest.fn(async () => ({ profile: null, error: null })),
    deleteChild: jest.fn(async () => null),
  };
}
