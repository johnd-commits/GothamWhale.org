import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { InfoScreen } from '@/components/info-screen';
import { SquishButton } from '@/components/squish-button';
import { WhaleCard } from '@/components/whale-card';
import { usePlayProgress } from '@/lib/play-progress';
import { getSupabaseClient } from '@/lib/supabase';
import { colors, font } from '@/theme/tokens';

type WhaleRow = {
  id: string;
  name: string;
  catalog_id: string;
};

type Tale = {
  title: string;
  body: string;
};

const whaleCacheKey = 'tideline-whale-cards';
const taleCacheKey = 'tideline-tale';
const sampleImage = require('../../../assets/images/sample-fluke.png');

const sampleWhales: WhaleRow[] = [
  { id: 'sample-nyc0001', name: 'NYC0001', catalog_id: 'NYC0001' },
  { id: 'sample-nyc0144', name: 'NYC0144', catalog_id: 'NYC0144' },
  { id: 'sample-nyc0290', name: 'Gotham', catalog_id: 'NYC0290' },
];

const sampleTale: Tale = {
  title: 'A tail like a fingerprint',
  body: 'Each humpback tail is different. Stay at least 100 yards away, and go to the water with a grown-up.',
};

export default function MyWhaleScreen() {
  const router = useRouter();
  const [whales, setWhales] = useState<WhaleRow[]>(sampleWhales);
  const [tale, setTale] = useState<Tale>(sampleTale);
  const [wordIndex, setWordIndex] = useState(-1);
  const [notice, setNotice] = useState('Pick a whale to follow.');
  const followedWhaleIds = usePlayProgress((state) => state.followedWhaleIds);
  const followWhale = usePlayProgress((state) => state.followWhale);
  const addTale = usePlayProgress((state) => state.addTale);

  useEffect(() => {
    let ignore = false;
    void AsyncStorage.getItem(whaleCacheKey).then((raw) => {
      if (ignore || raw === null) {
        return;
      }
      const saved = JSON.parse(raw) as WhaleRow[];
      if (saved.length > 0) {
        setWhales(saved);
      }
    });
    void AsyncStorage.getItem(taleCacheKey).then((raw) => {
      if (ignore || raw === null) {
        return;
      }
      setTale(JSON.parse(raw) as Tale);
    });

    const client = getSupabaseClient();
    if (client === null) {
      return () => {
        ignore = true;
      };
    }

    void client
      .from('whales')
      .select('id, name, catalog_id')
      .then(({ data }) => {
        if (ignore || data === null || data.length === 0) {
          return;
        }
        const rows = data as WhaleRow[];
        setWhales(rows);
        void AsyncStorage.setItem(whaleCacheKey, JSON.stringify(rows));
      });

    void client
      .from('whale_tales')
      .select('title, body')
      .limit(1)
      .then(({ data }) => {
        if (ignore || data === null || data.length === 0) {
          return;
        }
        const next = data[0] as Tale;
        setTale(next);
        void AsyncStorage.setItem(taleCacheKey, JSON.stringify(next));
      });

    return () => {
      ignore = true;
      void Speech.stop();
    };
  }, []);

  const words = tale.body.split(' ');

  return (
    <InfoScreen title="My Whale" message={notice} scroll>
      {whales.map((whale) => {
        const following = followedWhaleIds.includes(whale.id);
        return (
          <View key={whale.id} style={styles.block}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Open ${whale.name}`}
              onPress={() => router.push(`/whale/${whale.id}`)}
            >
              <WhaleCard image={sampleImage} name={whale.name} />
            </Pressable>
            <SquishButton
              label={following ? 'Following' : 'Follow'}
              onPress={() => {
                followWhale(whale.id);
                setNotice(`${whale.name} is on your follow list.`);
              }}
            />
          </View>
        );
      })}
      <Text accessibilityRole="header" style={styles.taleTitle}>
        {tale.title}
      </Text>
      <Text style={styles.tale}>
        {words.map((word, index) => (
          <Text key={`${word}-${index}`} style={index === wordIndex ? styles.spoken : undefined}>
            {index === 0 ? word : ` ${word}`}
          </Text>
        ))}
      </Text>
      <SquishButton
        label="Read aloud"
        onPress={() => {
          void Speech.stop();
          setWordIndex(0);
          const timer = setInterval(() => {
            setWordIndex((current) => current + 1);
          }, 320);
          Speech.speak(tale.body, {
            onDone: () => {
              clearInterval(timer);
              setWordIndex(-1);
              addTale();
              setNotice('You finished this week\'s tale.');
            },
            onStopped: () => {
              clearInterval(timer);
              setWordIndex(-1);
            },
          });
        }}
      />
    </InfoScreen>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: 16 },
  taleTitle: {
    color: colors.ink,
    fontFamily: font.bold,
    fontSize: 28,
    marginTop: 8,
  },
  tale: {
    color: colors.ink,
    fontFamily: font.regular,
    fontSize: 20,
    lineHeight: 30,
  },
  spoken: {
    backgroundColor: colors.sand,
  },
});
