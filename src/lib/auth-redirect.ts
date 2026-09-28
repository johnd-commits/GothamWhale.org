const returnPaths = ['/signup', '/reset-password'] as const;

export type AuthReturnPath = (typeof returnPaths)[number];

export function authReturnUrl(
  origin: string | null | undefined,
  path: AuthReturnPath,
): string | undefined {
  if (!origin || !returnPaths.includes(path)) {
    return undefined;
  }
  try {
    const url = new URL(origin);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return undefined;
    }
    return `${url.origin}${path}`;
  } catch {
    return undefined;
  }
}

export function emailConfirmationRedirect(origin: string | null | undefined): string | undefined {
  return authReturnUrl(origin, '/signup');
}

export function passwordResetRedirect(origin: string | null | undefined): string | undefined {
  return authReturnUrl(origin, '/reset-password');
}

export function currentAuthReturn(path: AuthReturnPath): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return authReturnUrl(window.location.origin, path);
}
