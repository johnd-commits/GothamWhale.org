import * as Location from 'expo-location';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Celebration } from '@/components/celebration';
import { InfoScreen } from '@/components/info-screen';
import { Mascot } from '@/components/mascot-placeholder';
import { SquishButton } from '@/components/squish-button';
import { WhaleCard } from '@/components/whale-card';
import { difficultyForStreak, flukeHint, scoreAnswer } from '@/lib/fluke-match';
import { useLocationPreference } from '@/lib/location-preference';
import { usePlayProgress } from '@/lib/play-progress';
import { completionRecord, isInsideQuest, questSafety } from '@/lib/quests';
import { colors, font } from '@/theme/tokens';

const sampleImage = require('../../../assets/images/sample-fluke.png');
const tails = ['Gotham', 'Harbor', 'Tide', 'Kelp'] as const;
const answer = 'Gotham';
const harborQuest = { latitude: 40.7, longitude: -74.02, radiusMeters: 400 };

export default function PlayScreen() {
  const [streak, setStreak] = useState(0);
  const [playId, setPlayId] = useState(0);
  const [note, setNote] = useState('Which tail matches?');
  const recordFluke = usePlayProgress((state) => state.recordFluke);
  const addQuest = usePlayProgress((state) => state.addQuest);
  const locationEnabled = useLocationPreference((state) => state.locationEnabled);
  const choices = tails.slice(0, difficultyForStreak(streak).choices);

  async function checkHarbor() {
    if (!locationEnabled) {
      setNote('Ask a grown-up to allow quest checks.');
      return;
    }
    let spot: Location.LocationObject;
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        setNote('The quest check stayed off.');
        return;
      }
      spot = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
    } catch {
      setNote('The quest check stayed on this device. Nothing was saved.');
      return;
    }
    const inside = isInsideQuest(
      { latitude: spot.coords.latitude, longitude: spot.coords.longitude },
      harborQuest,
    );
    if (!inside) {
      setNote('This quest circle is somewhere else. Nothing was saved.');
      return;
    }
    const saved = completionRecord('harbor-path', new Date());
    addQuest(true);
    setNote(`Harbor path saved for ${saved.completedOn}. ${questSafety}`);
    setPlayId((current) => current + 1);
  }

  return (
    <InfoScreen title="Play" message={note} scroll>
      <WhaleCard image={sampleImage} name="Mystery tail" />
      <Mascot state="thinking" />
      <Text style={styles.hint}>{flukeHint}</Text>
      {choices.map((name) => (
        <SquishButton
          key={name}
          label={name}
          onPress={() => {
            const result = scoreAnswer(name === answer, streak);
            setStreak(result.streak);
            recordFluke(result.correct);
            setNote(result.correct ? 'Yes. That tail matches.' : 'Look again at the edge and the scars.');
            if (result.correct) {
              setPlayId((current) => current + 1);
            }
          }}
        />
      ))}
      <Text style={styles.section}>Harbor quest</Text>
      <Text style={styles.hint}>{questSafety}</Text>
      <SquishButton label="Check the harbor path" onPress={() => void checkHarbor()} />
      <SquishButton
        label="Draw a fluke at home"
        onPress={() => {
          const saved = completionRecord('draw-a-fluke', new Date());
          addQuest(false);
          setNote(`Home quest saved for ${saved.completedOn}.`);
        }}
      />
      <Celebration playId={playId} variant="small" />
    </InfoScreen>
  );
}

const styles = StyleSheet.create({
  hint: {
    color: colors.ink,
    fontFamily: font.regular,
    fontSize: 18,
  },
  section: {
    color: colors.ink,
    fontFamily: font.bold,
    fontSize: 28,
  },
});
