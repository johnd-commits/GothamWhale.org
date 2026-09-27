import { placeholderConsentProvider, type ConsentDecision, type ConsentProvider } from '@/lib/consent';
import { isAgeBand, isAvatar, isNickname, type AgeBand, type Avatar, type Nickname } from '@/lib/child-options';
import type { ChildProfileRecord } from '@/lib/child-records';

export type AdultSession =
  | { status: 'ready'; adultId: string }
  | { status: 'confirm-email' }
  | { status: 'need-consent' }
  | { status: 'error'; message: string };

export type AdultAuth = {
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ userId: string | null; hasSession: boolean; error: string | null }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ userId: string | null; error: string | null }>;
  hasAdultRow: (adultId: string) => Promise<boolean>;
  insertAdult: (adultId: string, consent: ConsentDecision) => Promise<string | null>;
  listChildren: () => Promise<ChildProfileRecord[]>;
  insertChild: (input: {
    adultId: string;
    nickname: Nickname;
    avatar: Avatar;
    ageBand: AgeBand;
  }) => Promise<{ profile: ChildProfileRecord | null; error: string | null }>;
  deleteChild: (childId: string) => Promise<string | null>;
};

export function adultEmailOk(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function adultPasswordOk(password: string): boolean {
  return password.length >= 8;
}

function friendlyAuthError(error: string): string {
  if (error.toLowerCase().includes('already')) {
    return 'That email already has an account. Sign in instead.';
  }
  return 'That email could not be used. Try again.';
}

export async function registerAdult(
  auth: AdultAuth,
  input: { email: string; password: string; acceptedNotice: boolean },
  consent: ConsentProvider = placeholderConsentProvider,
): Promise<AdultSession> {
  if (!input.acceptedNotice) {
    return { status: 'need-consent' };
  }
  if (!adultEmailOk(input.email) || !adultPasswordOk(input.password)) {
    return { status: 'error', message: 'Use a real email and at least 8 characters.' };
  }

  const decision = await consent.requestConsent(true);
  if (!decision || decision.status !== 'granted') {
    return { status: 'need-consent' };
  }

  const signedUp = await auth.signUp(input.email.trim(), input.password);
  if (signedUp.error || !signedUp.userId) {
    return { status: 'error', message: friendlyAuthError(signedUp.error ?? 'signup failed') };
  }
  if (!signedUp.hasSession) {
    return { status: 'confirm-email' };
  }

  const insertError = await auth.insertAdult(signedUp.userId, decision);
  if (insertError) {
    return { status: 'error', message: 'The account was made, but consent was not saved.' };
  }
  return { status: 'ready', adultId: signedUp.userId };
}

export async function signInAdult(
  auth: AdultAuth,
  input: { email: string; password: string; acceptedNotice: boolean },
  consent: ConsentProvider = placeholderConsentProvider,
): Promise<AdultSession> {
  if (!adultEmailOk(input.email) || input.password.length === 0) {
    return { status: 'error', message: 'Enter the email and password for this account.' };
  }

  const signedIn = await auth.signIn(input.email.trim(), input.password);
  if (signedIn.error || !signedIn.userId) {
    return { status: 'error', message: 'That sign-in did not work.' };
  }

  if (await auth.hasAdultRow(signedIn.userId)) {
    return { status: 'ready', adultId: signedIn.userId };
  }

  const decision = await consent.requestConsent(input.acceptedNotice);
  if (!decision || decision.status !== 'granted') {
    return { status: 'need-consent' };
  }
  const insertError = await auth.insertAdult(signedIn.userId, decision);
  if (insertError) {
    return { status: 'error', message: 'Consent was not saved.' };
  }
  return { status: 'ready', adultId: signedIn.userId };
}

export async function createChildProfile(
  auth: AdultAuth,
  adultId: string,
  input: { nickname: string; avatar: string; ageBand: string },
): Promise<{ profile: ChildProfileRecord | null; error: string | null }> {
  if (!isNickname(input.nickname) || !isAvatar(input.avatar) || !isAgeBand(input.ageBand)) {
    return { profile: null, error: 'Pick a nickname, an avatar, and an age band.' };
  }
  return auth.insertChild({
    adultId,
    nickname: input.nickname,
    avatar: input.avatar,
    ageBand: input.ageBand,
  });
}

export async function deleteChildProfile(auth: AdultAuth, childId: string): Promise<string | null> {
  return auth.deleteChild(childId);
}
