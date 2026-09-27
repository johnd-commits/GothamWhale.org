import { InfoScreen } from '@/components/info-screen';
import { BigLink } from '@/components/big-link';

export default function NotFoundScreen() {
  return (
    <InfoScreen title="Missing page" message="That page is not here.">
      <BigLink href="/" label="Go home" />
    </InfoScreen>
  );
}
