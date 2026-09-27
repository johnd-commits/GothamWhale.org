export type ConsentDecision = {
  status: 'granted' | 'revoked';
  consentedAt: string;
};

/**
 * Swap this object for a real consent check later.
 * The placeholder only records that the grown-up accepted the notice on this device.
 * It does not send the email address anywhere.
 */
export interface ConsentProvider {
  requestConsent(acceptedNotice: boolean, now?: Date): Promise<ConsentDecision | null>;
}

export const placeholderConsentProvider: ConsentProvider = {
  async requestConsent(acceptedNotice, now = new Date()) {
    if (!acceptedNotice) {
      return null;
    }
    return {
      status: 'granted',
      consentedAt: now.toISOString(),
    };
  },
};

export const privacyNotice =
  'Tide Line is free. Your email is only for this grown-up account. Children do not make accounts and we do not ask for their email. A child profile stores a nickname from a list, an avatar, an age band, and progress. It does not store a real name, a photo of the child, or where the child is. You can delete a child\'s data from this area.';
