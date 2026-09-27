import { BigLink } from '@/components/big-link';
import { InfoScreen } from '@/components/info-screen';

export default function HomeScreen() {
  return (
    <InfoScreen title="Home" message="Hello! Ready to visit the harbor?">
      <BigLink href="/grown-ups" label="Grown-ups" />
    </InfoScreen>
  );
}
