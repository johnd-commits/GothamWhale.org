export function roundTo2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function kidSightingMessage(whaleName: string, latitude: number, longitude: number): string {
  const lat = roundTo2(latitude);
  const lng = roundTo2(longitude);
  const nearRockaways = Math.abs(lat - 40.58) <= 0.15 && Math.abs(lng - -73.83) <= 0.15;
  const place = nearRockaways ? 'near the Rockaways' : 'in the harbor';
  return `Your whale ${whaleName} was spotted ${place}!`;
}

export function newSightingIds(seenIds: string[], incomingIds: string[]): string[] {
  const seen = new Set(seenIds);
  return incomingIds.filter((id) => !seen.has(id));
}

export type MapPoint = { x: number; y: number };

export function plotRoundedPoint(
  latitude: number,
  longitude: number,
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
): MapPoint {
  const lat = roundTo2(latitude);
  const lng = roundTo2(longitude);
  const latSpan = bounds.maxLat - bounds.minLat || 1;
  const lngSpan = bounds.maxLng - bounds.minLng || 1;
  return {
    x: (lng - bounds.minLng) / lngSpan,
    y: (bounds.maxLat - lat) / latSpan,
  };
}
