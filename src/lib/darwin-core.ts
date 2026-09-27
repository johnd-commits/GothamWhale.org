export type PublicSightingRow = {
  occurrenceID: string;
  basisOfRecord: string;
  eventDate: string;
  scientificName: string;
  individualCount: number;
  decimalLatitude: number | null;
  decimalLongitude: number | null;
};

const columns = [
  'occurrenceID',
  'basisOfRecord',
  'eventDate',
  'scientificName',
  'individualCount',
  'decimalLatitude',
  'decimalLongitude',
] as const;

function cell(value: string | number | null): string {
  if (value === null) {
    return '';
  }
  const text = String(value);
  if (text.includes(',') || text.includes('"')) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

export function toDarwinCoreCsv(rows: PublicSightingRow[]): string {
  const lines = [columns.join(',')];
  for (const row of rows) {
    lines.push(columns.map((column) => cell(row[column])).join(','));
  }
  return lines.join('\n');
}
