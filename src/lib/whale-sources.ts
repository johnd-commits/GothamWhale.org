export type WhaleSpecies = 'humpback' | 'right-whale';

export type WhaleSource = {
  name: string;
  organization: string;
  species: WhaleSpecies[];
  idFeature: string;
  offers: string;
  access: string;
  url: string;
};

export type NamedWhale = {
  name: string;
  species: WhaleSpecies;
  catalogId: string | null;
  mark: string;
  where: string;
  url: string;
};

export const whaleSources: WhaleSource[] = [
  {
    name: 'Happywhale',
    organization: 'Happywhale',
    species: ['humpback'],
    idFeature: 'Underside of the flukes',
    offers: 'Browse fluke photos, names, and sighting maps. Each whale has its own page.',
    access: 'Open to browse',
    url: 'https://happywhale.com',
  },
  {
    name: 'Gulf of Maine naming',
    organization: 'Center for Coastal Studies, Provincetown',
    species: ['humpback'],
    idFeature: 'Underside of the flukes',
    offers: 'Naming rules for Gulf of Maine humpbacks. Names come from marks on the tail.',
    access: 'The naming page is open. The full catalog is a research database.',
    url: 'https://coastalstudies.org/our-work/humpback-whale-research/gulf-of-maine/naming/',
  },
  {
    name: 'Gulf of Maine photo form',
    organization: 'Center for Coastal Studies',
    species: ['humpback'],
    idFeature: 'Underside of the flukes',
    offers: 'Send a fluke photo for identification.',
    access: 'Open form',
    url: 'https://form.jotform.com/33236318539154',
  },
  {
    name: 'North Atlantic Humpback Whale Catalog',
    organization: 'Allied Whale, College of the Atlantic',
    species: ['humpback'],
    idFeature: 'Underside of the flukes',
    offers: 'Ocean-wide catalog started in 1977. It now holds sightings of nearly 13,000 humpbacks.',
    access: 'The research page is open. The full catalog goes through the researchers.',
    url: 'https://www.coa.edu/academics/allied-whale/research/',
  },
  {
    name: 'Allied Whale adoption profiles',
    organization: 'Allied Whale, College of the Atlantic',
    species: ['humpback'],
    idFeature: 'Flukes and the dorsal fin',
    offers: 'Short profiles of featured named whales.',
    access: 'Open',
    url: 'https://www.coa.edu/allied-whale/adopt-a-whale/',
  },
  {
    name: 'Recognizing humpbacks',
    organization: 'NOAA Stellwagen Bank National Marine Sanctuary',
    species: ['humpback'],
    idFeature: 'Underside of the flukes',
    offers: 'A primer with fluke photos and how six whales got their names.',
    access: 'Open',
    url: 'https://stellwagen.noaa.gov/visit/whalewatching/recognizing-humpbacks.html',
  },
  {
    name: 'Blue Ocean Society profiles',
    organization: 'Blue Ocean Society, Portsmouth',
    species: ['humpback'],
    idFeature: 'Underside of the flukes',
    offers: 'Profiles of local named whales.',
    access: 'Open',
    url: 'https://blueoceansociety.org/?p=67',
  },
  {
    name: 'North Atlantic Right Whale Catalog',
    organization: 'New England Aquarium',
    species: ['right-whale'],
    idFeature: 'Callosities on the head',
    offers: 'Drawings, photos, and sighting histories. Right whales are told apart by head marks, not tails.',
    access: 'Open search',
    url: 'https://rwcatalog.neaq.org',
  },
  {
    name: 'Historic fluke photo',
    organization: 'NOAA Central Library',
    species: ['humpback'],
    idFeature: 'Underside of the flukes',
    offers: 'An early Gulf of Maine fluke photo from about 1971.',
    access: 'Open',
    url: 'https://noaa.gov/media/78257',
  },
];

export const namedWhales: NamedWhale[] = [
  {
    name: 'Salt',
    species: 'humpback',
    catalogId: null,
    mark: 'White scarring on the dorsal fin that looks like salt. She was the first named Gulf of Maine humpback.',
    where: 'Center for Coastal Studies naming page',
    url: 'https://coastalstudies.org/our-work/humpback-whale-research/gulf-of-maine/naming/',
  },
  {
    name: 'Pepper',
    species: 'humpback',
    catalogId: null,
    mark: 'An all-black dorsal fin, named alongside Salt.',
    where: 'Center for Coastal Studies naming page',
    url: 'https://coastalstudies.org/our-work/humpback-whale-research/gulf-of-maine/naming/',
  },
  {
    name: 'Chromosome',
    species: 'humpback',
    catalogId: null,
    mark: 'A large scar on the left fluke that looks like an X.',
    where: 'NOAA Stellwagen page',
    url: 'https://stellwagen.noaa.gov/visit/whalewatching/recognizing-humpbacks.html',
  },
  {
    name: 'Echo',
    species: 'humpback',
    catalogId: null,
    mark: 'Rake marks on the left fluke. This is a Gulf of Maine whale, not a child nickname.',
    where: 'NOAA Stellwagen page',
    url: 'https://stellwagen.noaa.gov/visit/whalewatching/recognizing-humpbacks.html',
  },
  {
    name: 'Lavalier',
    species: 'humpback',
    catalogId: null,
    mark: 'A black mark on the white right fluke that looks like a pendant.',
    where: 'NOAA Stellwagen page',
    url: 'https://stellwagen.noaa.gov/visit/whalewatching/recognizing-humpbacks.html',
  },
  {
    name: 'Nile',
    species: 'humpback',
    catalogId: null,
    mark: 'A twisting scar on the outer left fluke.',
    where: 'NOAA Stellwagen page',
    url: 'https://stellwagen.noaa.gov/visit/whalewatching/recognizing-humpbacks.html',
  },
  {
    name: 'Pele',
    species: 'humpback',
    catalogId: null,
    mark: 'The name story is on the NOAA page.',
    where: 'NOAA Stellwagen page',
    url: 'https://stellwagen.noaa.gov/visit/whalewatching/recognizing-humpbacks.html',
  },
  {
    name: 'Wyoming',
    species: 'humpback',
    catalogId: null,
    mark: 'The name story is on the NOAA page.',
    where: 'NOAA Stellwagen page',
    url: 'https://stellwagen.noaa.gov/visit/whalewatching/recognizing-humpbacks.html',
  },
  {
    name: 'Owl',
    species: 'humpback',
    catalogId: null,
    mark: 'Fluke markings that look like an owl. A female born in 1986.',
    where: 'Blue Ocean Society page',
    url: 'https://blueoceansociety.org/?p=67',
  },
  {
    name: 'Sword',
    species: 'humpback',
    catalogId: 'NAHWC na00124',
    mark: 'Search this name on Happywhale for the fluke photo.',
    where: 'Happywhale',
    url: 'https://happywhale.com',
  },
  {
    name: 'Snow Plow',
    species: 'humpback',
    catalogId: null,
    mark: 'Studied in the southern Gulf of Maine since 1998.',
    where: 'Happywhale',
    url: 'https://happywhale.com',
  },
  {
    name: 'Wolf',
    species: 'right-whale',
    catalogId: 'NARWC 1703',
    mark: 'Told apart by callosities on the head, not by the tail.',
    where: 'New England Aquarium right whale catalog',
    url: 'https://rwcatalog.neaq.org',
  },
];

export function filterWhaleSources(
  sources: WhaleSource[],
  query: { text: string; species: 'all' | WhaleSpecies },
): WhaleSource[] {
  const text = query.text.trim().toLowerCase();
  return sources.filter((source) => {
    if (query.species !== 'all' && !source.species.includes(query.species)) {
      return false;
    }
    if (text.length === 0) {
      return true;
    }
    return `${source.name} ${source.organization} ${source.idFeature} ${source.offers}`
      .toLowerCase()
      .includes(text);
  });
}

export function filterNamedWhales(
  whales: NamedWhale[],
  query: { text: string; species: 'all' | WhaleSpecies },
): NamedWhale[] {
  const text = query.text.trim().toLowerCase();
  return whales.filter((whale) => {
    if (query.species !== 'all' && whale.species !== query.species) {
      return false;
    }
    if (text.length === 0) {
      return true;
    }
    const catalogId = whale.catalogId ?? '';
    return `${whale.name} ${catalogId} ${whale.mark}`.toLowerCase().includes(text);
  });
}
