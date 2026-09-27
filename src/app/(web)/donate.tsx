import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AdultGate } from '@/components/adult-gate';
import { ChoiceList } from '@/components/choice-list';
import { InfoScreen } from '@/components/info-screen';
import { SquishButton } from '@/components/squish-button';
import { placeholderPaymentProvider } from '@/lib/payments';
import { colors, font } from '@/theme/tokens';

const whales = ['Gotham', 'Harbor', 'Tide'] as const;
const tiers = ['Friend', 'Fluke', 'Harbor'] as const;

const storeQuestions = [
  'What is the donation for, in words a parent can read before paying?',
  'Is the gift consumable, non-consumable, or a subscription?',
  'Which organization receives the money?',
  'How does a parent restore a previous gift on a new phone?',
  'Can a child reach the payment button from a kid screen?',
];

export default function DonateScreen() {
  return (
    <AdultGate>
      <AdoptWhale />
    </AdultGate>
  );
}

function AdoptWhale() {
  const [whale, setWhale] = useState<string | null>(null);
  const [tier, setTier] = useState<string | null>(null);
  const [note, setNote] = useState(
    'This page is for grown-ups. No card is charged. Kids do not see a purchase button.',
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Adopt a whale' }} />
      <InfoScreen message={note} scroll>
        <ChoiceList label="Whale" options={whales} value={whale} onChange={setWhale} />
        <ChoiceList label="Gift" options={tiers} value={tier} onChange={setTier} />
        <SquishButton
          label="Pledge"
          onPress={() => {
            if (whale === null || tier === null) {
              setNote('Pick a whale and a gift first.');
              return;
            }
            void placeholderPaymentProvider
              .pledge({ adultId: 'this-grown-up', whaleId: whale, tierId: tier })
              .then((charge) => {
                setNote(`Pledged ${charge.tierId} for ${charge.whaleId}. No card was charged.`);
              });
          }}
        />
        <Text style={styles.heading}>Questions to answer before a real app-store payment</Text>
        {storeQuestions.map((question) => (
          <Text key={question} style={styles.question}>
            {question}
          </Text>
        ))}
      </InfoScreen>
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: colors.ink,
    fontFamily: font.bold,
    fontSize: 22,
  },
  question: {
    color: colors.ink,
    fontFamily: font.regular,
    fontSize: 18,
  },
});
