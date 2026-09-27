export function emailConfirmationRedirect(origin: string | null | undefined): string | undefined {
  if (!origin) {
    return undefined;
  }
  try {
    const url = new URL(origin);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return undefined;
    }
    return `${url.origin}/signup`;
  } catch {
    return undefined;
  }
}
