import { BigLink } from '@/components/big-link';
import { InfoScreen } from '@/components/info-screen';
import { ProfileSwitcher } from '@/components/profile-switcher';
import { useFamilyProfiles } from '@/lib/use-family';

export default function HomeScreen() {
  const { profiles, activeChildId, setActiveChildId } = useFamilyProfiles();

  return (
    <InfoScreen title="Home" message="Hello! Ready to visit the harbor?" scroll>
      <ProfileSwitcher
        profiles={profiles}
        activeId={activeChildId}
        onSelect={setActiveChildId}
      />
      <BigLink href="/grown-ups" label="Grown-ups" />
    </InfoScreen>
  );
}
