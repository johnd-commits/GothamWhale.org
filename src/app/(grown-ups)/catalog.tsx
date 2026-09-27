import { Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';

import { ChoiceList } from '@/components/choice-list';
import { WhaleReference } from '@/components/whale-reference';
import { InfoScreen } from '@/components/info-screen';
import { SquishButton } from '@/components/squish-button';
import { WhaleCard } from '@/components/whale-card';
import {
  catalogIdOk,
  catalogKinds,
  emptyCatalogQuery,
  filterCatalog,
  flukeMarks,
  harborPlaces,
  isCatalogDay,
  tailShades,
  type CatalogKind,
  type CatalogQuery,
  type CatalogRecord,
  type FlukeMark,
  type HarborPlace,
  type TailShade,
} from '@/lib/catalog';
import { catalogRecords, useCatalog } from '@/lib/catalog-store';
import { colors, font, radius, tapTarget } from '@/theme/tokens';

const sampleImage = require('../../../assets/images/sample-fluke.png');

const kindLabels: Record<CatalogQuery['kind'], string> = {
  all: 'All records',
  'known-whale': 'Known whales',
  sighting: 'Sightings',
};
const sexLabels: Record<CatalogQuery['sex'], string> = {
  all: 'Any sex',
  female: 'Female',
  male: 'Male',
  unknown: 'Unknown',
};
const shadeLabels: Record<CatalogQuery['tailShade'], string> = {
  all: 'Any tail shade',
  'mostly-white': 'Mostly white',
  mixed: 'Mixed',
  'mostly-black': 'Mostly black',
};
const markLabels: Record<CatalogQuery['mark'], string> = {
  all: 'Any mark',
  'trailing-edge': 'Trailing edge',
  pigment: 'Pigment',
  scars: 'Scars',
};
const placeLabels: Record<CatalogQuery['place'], string> = {
  all: 'Any harbor place',
  rockaways: 'Rockaways',
  harbor: 'Harbor',
  hudson: 'Hudson',
  bight: 'New York Bight',
};
const dateLabels: Record<CatalogQuery['dateMode'], string> = {
  any: 'Any day',
  on: 'On this day',
  before: 'Before this day',
  after: 'After this day',
};

function keyFor<T extends string>(labels: Record<T, string>, label: string): T {
  const found = (Object.keys(labels) as T[]).find((key) => labels[key] === label);
  return found ?? (Object.keys(labels)[0] as T);
}

export default function CatalogScreen() {
  const added = useCatalog((state) => state.added);
  const addRecord = useCatalog((state) => state.addRecord);
  const [query, setQuery] = useState<CatalogQuery>(emptyCatalogQuery);
  const [draft, setDraft] = useState<Omit<CatalogRecord, 'id'>>({
    catalogId: '',
    kind: 'known-whale',
    sex: 'unknown',
    tailShade: 'mixed',
    marks: ['trailing-edge'],
    place: 'harbor',
    seenOn: '2026-09-27',
    imageUri: null,
    note: '',
  });
  const [message, setMessage] = useState(
    'Search known whales and sightings. Photos you add stay on this device. Stay at least 100 yards from whales.',
  );

  const matches = filterCatalog(catalogRecords(added), query);

  async function choosePhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setMessage('The photo picker stayed off.');
      return;
    }
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (picked.canceled || picked.assets.length === 0) {
      return;
    }
    setDraft((current) => ({ ...current, imageUri: picked.assets[0].uri }));
  }

  function saveRecord() {
    if (!catalogIdOk(draft.catalogId) || !isCatalogDay(draft.seenOn)) {
      setMessage('Use a catalog code like NYC0001 and a day like 2026-09-27.');
      return;
    }
    addRecord({
      ...draft,
      id: `local-${draft.catalogId}-${draft.seenOn}`,
      catalogId: draft.catalogId.trim().toUpperCase(),
      note: draft.note.trim().slice(0, 80),
    });
    setMessage(`${draft.catalogId.trim().toUpperCase()} is in the catalog on this device.`);
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Whale catalog' }} />
      <InfoScreen message={message} scroll>
        <Text style={styles.heading}>Search</Text>
        <TextInput
          accessibilityLabel="Catalog code"
          autoCapitalize="characters"
          value={query.text}
          onChangeText={(text) => setQuery((current) => ({ ...current, text }))}
          placeholder="NYC0001"
          placeholderTextColor={colors.sea}
          style={styles.input}
        />
        <ChoiceList
          label="Record"
          options={Object.values(kindLabels)}
          value={kindLabels[query.kind]}
          onChange={(label) => setQuery((current) => ({ ...current, kind: keyFor(kindLabels, label) }))}
        />
        <ChoiceList
          label="Sex"
          options={Object.values(sexLabels)}
          value={sexLabels[query.sex]}
          onChange={(label) => setQuery((current) => ({ ...current, sex: keyFor(sexLabels, label) }))}
        />
        <ChoiceList
          label="Tail shade"
          options={Object.values(shadeLabels)}
          value={shadeLabels[query.tailShade]}
          onChange={(label) =>
            setQuery((current) => ({ ...current, tailShade: keyFor(shadeLabels, label) }))
          }
        />
        <ChoiceList
          label="Mark"
          options={Object.values(markLabels)}
          value={markLabels[query.mark]}
          onChange={(label) => setQuery((current) => ({ ...current, mark: keyFor(markLabels, label) }))}
        />
        <ChoiceList
          label="Place"
          options={Object.values(placeLabels)}
          value={placeLabels[query.place]}
          onChange={(label) => setQuery((current) => ({ ...current, place: keyFor(placeLabels, label) }))}
        />
        <ChoiceList
          label="Day"
          options={Object.values(dateLabels)}
          value={dateLabels[query.dateMode]}
          onChange={(label) =>
            setQuery((current) => ({ ...current, dateMode: keyFor(dateLabels, label) }))
          }
        />
        <TextInput
          accessibilityLabel="Filter day"
          value={query.date}
          onChangeText={(date) => setQuery((current) => ({ ...current, date }))}
          placeholder="2026-09-27"
          placeholderTextColor={colors.sea}
          style={styles.input}
        />
        <Text style={styles.heading}>{matches.length} matches</Text>
        {matches.map((record) => (
          <View key={record.id} style={styles.card}>
            {record.imageUri ? (
              <Image
                accessibilityLabel={record.catalogId}
                source={{ uri: record.imageUri }}
                style={styles.photo}
              />
            ) : (
              <WhaleCard image={sampleImage} name={record.catalogId} />
            )}
            <Text style={styles.line}>
              {kindLabels[record.kind]} · {placeLabels[record.place]} · {record.seenOn}
            </Text>
            <Text style={styles.line}>
              {shadeLabels[record.tailShade]} · {record.marks.map((mark) => markLabels[mark]).join(', ')}
            </Text>
          </View>
        ))}
        <WhaleReference />
        <Text style={styles.heading}>Add a card</Text>
        <TextInput
          accessibilityLabel="New catalog code"
          autoCapitalize="characters"
          value={draft.catalogId}
          onChangeText={(catalogId) => setDraft((current) => ({ ...current, catalogId }))}
          placeholder="NYC0501"
          placeholderTextColor={colors.sea}
          style={styles.input}
        />
        <TextInput
          accessibilityLabel="Day seen"
          value={draft.seenOn}
          onChangeText={(seenOn) => setDraft((current) => ({ ...current, seenOn }))}
          placeholder="2026-09-27"
          placeholderTextColor={colors.sea}
          style={styles.input}
        />
        <TextInput
          accessibilityLabel="Short note"
          value={draft.note}
          onChangeText={(note) => setDraft((current) => ({ ...current, note: note.slice(0, 80) }))}
          placeholder="Short note"
          placeholderTextColor={colors.sea}
          style={styles.input}
        />
        <ChoiceList
          label="This card is"
          options={catalogKinds.map((kind) => kindLabels[kind])}
          value={kindLabels[draft.kind]}
          onChange={(label) =>
            setDraft((current) => ({ ...current, kind: keyFor(kindLabels, label) as CatalogKind }))
          }
        />
        <ChoiceList
          label="Tail shade"
          options={tailShades.map((shade) => shadeLabels[shade])}
          value={shadeLabels[draft.tailShade]}
          onChange={(label) =>
            setDraft((current) => ({ ...current, tailShade: keyFor(shadeLabels, label) as TailShade }))
          }
        />
        <ChoiceList
          label="A mark on the tail"
          options={flukeMarks.map((mark) => markLabels[mark])}
          value={markLabels[draft.marks[0] ?? 'trailing-edge']}
          onChange={(label) =>
            setDraft((current) => ({
              ...current,
              marks: [keyFor(markLabels, label) as FlukeMark],
            }))
          }
        />
        <ChoiceList
          label="Place"
          options={harborPlaces.map((place) => placeLabels[place])}
          value={placeLabels[draft.place]}
          onChange={(label) =>
            setDraft((current) => ({ ...current, place: keyFor(placeLabels, label) as HarborPlace }))
          }
        />
        <SquishButton label={draft.imageUri ? 'Photo chosen' : 'Choose a tail photo'} onPress={() => void choosePhoto()} />
        <SquishButton label="Save this card" onPress={saveRecord} />
      </InfoScreen>
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: colors.ink,
    fontFamily: font.bold,
    fontSize: 28,
  },
  line: {
    color: colors.ink,
    fontFamily: font.regular,
    fontSize: 18,
  },
  card: { marginBottom: 16 },
  photo: {
    width: 220,
    height: 180,
    borderRadius: radius.card,
    backgroundColor: colors.mist,
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
