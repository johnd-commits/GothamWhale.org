type AdultSessionSnapshot = {
  ready: boolean;
  signedIn: boolean;
};

const listeners = new Set<() => void>();

let snapshot: AdultSessionSnapshot = { ready: false, signedIn: false };

export function noteAdultSession(signedIn: boolean): void {
  if (snapshot.ready && snapshot.signedIn === signedIn) {
    return;
  }
  snapshot = { ready: true, signedIn };
  listeners.forEach((listener) => listener());
}

export function adultSessionSnapshot(): AdultSessionSnapshot {
  return snapshot;
}

export function subscribeAdultSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
