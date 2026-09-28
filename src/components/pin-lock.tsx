import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { InfoScreen } from '@/components/info-screen';
import { SquishButton } from '@/components/squish-button';
import { hashPin, pinMatches } from '@/lib/pin';
import { usePinGate } from '@/lib/pin-gate';
import { colors, font, radius, tapTarget } from '@/theme/tokens';

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as const;

const choosePinMessage =
  'Choose 4 numbers for this browser. This lock is not your password. Tide Line does not have a PIN until you pick one.';
const enterPinMessage =
  'Enter the 4 numbers you chose on this browser. This is not your account password.';

export function PinLock({ replacing = false }: { replacing?: boolean }) {
  const pinHash = usePinGate((state) => state.pinHash);
  const setPinHash = usePinGate((state) => state.setPinHash);
  const unlock = usePinGate((state) => state.unlock);
  const requestPinReset = usePinGate((state) => state.requestPinReset);
  const choosing = replacing || !pinHash;
  const router = useRouter();
  const [entry, setEntry] = useState('');
  const [firstPin, setFirstPin] = useState<string | null>(null);
  const [message, setMessage] = useState(choosing ? choosePinMessage : enterPinMessage);

  function pushDigit(digit: string) {
    const next = `${entry}${digit}`.slice(0, 4);
    setEntry(next);
    if (next.length < 4) {
      return;
    }
    if (choosing) {
      if (!firstPin) {
        setFirstPin(next);
        setEntry('');
        setMessage('Enter the same PIN again.');
        return;
      }
      if (next !== firstPin) {
        setFirstPin(null);
        setEntry('');
        setMessage('Those PINs do not match. Try again.');
        return;
      }
      const hashed = hashPin(next);
      if (!hashed) {
        setEntry('');
        setMessage('Use 4 numbers.');
        return;
      }
      setPinHash(hashed);
      return;
    }
    if (pinHash && pinMatches(next, pinHash)) {
      unlock();
      return;
    }
    setEntry('');
    setMessage('That PIN does not match. Try again.');
  }

  return (
    <InfoScreen title="Grown-ups" message={message}>
      <Text accessibilityLabel={`${entry.length} of 4 digits`} style={styles.dots}>
        {Array.from({ length: 4 }, (_, index) => (index < entry.length ? '●' : '○')).join(' ')}
      </Text>
      <View style={styles.pad}>
        {digits.map((digit) => (
          <Pressable
            key={digit}
            accessibilityRole="button"
            accessibilityLabel={`Digit ${digit}`}
            style={styles.key}
            onPress={() => pushDigit(digit)}
          >
            <Text style={styles.keyLabel}>{digit}</Text>
          </Pressable>
        ))}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear PIN"
          style={styles.key}
          onPress={() => setEntry('')}
        >
          <Text style={styles.keyLabel}>Clear</Text>
        </Pressable>
      </View>
      {choosing ? null : (
        <SquishButton
          label="I forgot this PIN"
          sound={false}
          onPress={() => {
            requestPinReset();
            router.push('/signup');
          }}
        />
      )}
    </InfoScreen>
  );
}

const styles = StyleSheet.create({
  dots: {
    color: colors.ink,
    fontFamily: font.bold,
    fontSize: 28,
    textAlign: 'center',
  },
  pad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  key: {
    minWidth: 88,
    minHeight: tapTarget,
    paddingHorizontal: 12,
    borderRadius: radius.button,
    backgroundColor: colors.sea,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyLabel: {
    color: colors.white,
    fontFamily: font.semibold,
    fontSize: 22,
  },
});
