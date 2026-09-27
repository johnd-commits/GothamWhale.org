import { sha256Hex } from '@/lib/sha256';

export function isFourDigitPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

export function hashPin(pin: string): string | null {
  if (!isFourDigitPin(pin)) {
    return null;
  }
  return sha256Hex(pin);
}

export function pinMatches(pin: string, storedHash: string): boolean {
  const next = hashPin(pin);
  return next !== null && next === storedHash;
}
