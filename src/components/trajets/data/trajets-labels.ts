export const trajetsLabels: GeoJSON.FeatureCollection<GeoJSON.Point> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [3.8767, 43.6119] },
      properties: { name: 'Montpellier' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [3.9021, 43.5652] },
      properties: { name: 'Lattes' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [3.9539, 43.5692] },
      properties: { name: 'Pérols' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [3.9778, 43.5482] },
      properties: { name: 'Carnon' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [3.9326, 43.5319] },
      properties: { name: 'Palavas-les-Flots' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [4.0827, 43.5613] },
      properties: { name: 'La Grande-Motte' },
    },
  ],
};

