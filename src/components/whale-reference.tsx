import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ChoiceList } from '@/components/choice-list';
import {
  filterNamedWhales,
  filterWhaleSources,
  namedWhales,
  whaleSources,
  type WhaleSpecies,
} from '@/lib/whale-sources';
import { colors, font, radius, tapTarget } from '@/theme/tokens';

const speciesLabels = {
  all: 'All species',
  humpback: 'Humpback',
  'right-whale': 'Right whale',
} as const;

type SpeciesChoice = keyof typeof speciesLabels;

export function WhaleReference() {
  const [text, setText] = useState('');
  const [species, setSpecies] = useState<SpeciesChoice>('all');
  const query = { text, species: species === 'all' ? ('all' as const) : (species as WhaleSpecies) };
  const sources = filterWhaleSources(whaleSources, query);
  const whales = filterNamedWhales(namedWhales, query);

  return (
    <View style={styles.block}>
      <Text style={styles.heading}>Public catalogs</Text>
      <Text style={styles.line}>
        These pages belong to the groups that published them. Tide Line links out. It does not copy their photos.
      </Text>
      <TextInput
        accessibilityLabel="Search catalogs and whale names"
        value={text}
        onChangeText={setText}
        placeholder="Salt, Owl, fluke"
        placeholderTextColor={colors.sea}
        style={styles.input}
      />
      <ChoiceList
        label="Species"
        options={Object.values(speciesLabels)}
        value={speciesLabels[species]}
        onChange={(label) => {
          const next = (Object.keys(speciesLabels) as SpeciesChoice[]).find(
            (key) => speciesLabels[key] === label,
          );
          setSpecies(next ?? 'all');
        }}
      />
      {sources.map((source) => (
        <Pressable
          key={source.url + source.name}
          accessibilityRole="link"
          onPress={() => void Linking.openURL(source.url)}
          style={styles.link}
        >
          <Text style={styles.linkTitle}>{source.name}</Text>
          <Text style={styles.line}>
            {source.organization}. {source.idFeature}. {source.access}
          </Text>
        </Pressable>
      ))}
      <Text style={styles.heading}>Named whales</Text>
      {whales.map((whale) => (
        <Pressable
          key={whale.name}
          accessibilityRole="link"
          onPress={() => void Linking.openURL(whale.url)}
          style={styles.link}
        >
          <Text style={styles.linkTitle}>
            {whale.name}
            {whale.catalogId ? ` · ${whale.catalogId}` : ''}
          </Text>
          <Text style={styles.line}>{whale.mark}</Text>
          <Text style={styles.line}>{whale.where}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 8 },
  heading: {
    color: colors.ink,
    fontFamily: font.bold,
    fontSize: 28,
    marginTop: 8,
  },
  line: {
    color: colors.ink,
    fontFamily: font.regular,
    fontSize: 18,
  },
  link: {
    minHeight: tapTarget,
    borderRadius: radius.button,
    backgroundColor: colors.white,
    padding: 12,
  },
  linkTitle: {
    color: colors.deep,
    fontFamily: font.bold,
    fontSize: 20,
  },
  input: {
    minHeight: tapTarget,
    borderWidth: 3,
    borderColor: colors.mist,
    borderRadius: radius.button,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    color: colors.ink,
    fontFamily: font.regular,
    fontSize: 18,
  },
});
