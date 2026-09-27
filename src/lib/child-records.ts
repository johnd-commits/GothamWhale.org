export type ChildProfileRecord = {
  id: string;
  nickname: string;
  avatar: string;
  ageBand: string;
};

export type ChildDataSnapshot = {
  profiles: ChildProfileRecord[];
  follows: { childId: string }[];
  badges: { childId: string }[];
  questCompletions: { childId: string }[];
  dexEntries: { childId: string | null }[];
  classMembers: { childId: string }[];
};

export function deleteChildFromSnapshot(
  snapshot: ChildDataSnapshot,
  childId: string,
): ChildDataSnapshot {
  const keep = (row: { childId: string | null }) => row.childId !== childId;
  return {
    profiles: snapshot.profiles.filter((profile) => profile.id !== childId),
    follows: snapshot.follows.filter(keep),
    badges: snapshot.badges.filter(keep),
    questCompletions: snapshot.questCompletions.filter(keep),
    dexEntries: snapshot.dexEntries.filter(keep),
    classMembers: snapshot.classMembers.filter(keep),
  };
}

export function chooseActiveChild(profileIds: string[], activeId: string | null): string | null {
  if (activeId && profileIds.includes(activeId)) {
    return activeId;
  }
  if (profileIds.length === 1) {
    return profileIds[0];
  }
  return null;
}
