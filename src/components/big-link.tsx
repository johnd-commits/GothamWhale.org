import { Link, type Href } from 'expo-router';

import { SquishButton } from '@/components/squish-button';

type BigLinkProps = {
  href: Href;
  label: string;
};

export function BigLink({ href, label }: BigLinkProps) {
  return (
    <Link href={href} asChild>
      <SquishButton label={label} />
    </Link>
  );
}
