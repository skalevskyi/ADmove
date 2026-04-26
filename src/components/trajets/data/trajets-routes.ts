import {
  route20260423,
  route20260424,
  route20260425,
} from '@/components/trajets/data/generated/preview-routes';

export type TrajetsRouteId =
  | 'day-1'
  | 'day-2'
  | 'day-3'
  | 'day-4'
  | 'day-5'
  | 'day-6'
  | 'day-7';

export const trajetsRouteIds: readonly TrajetsRouteId[] = [
  'day-1',
  'day-2',
  'day-3',
  'day-4',
  'day-5',
  'day-6',
  'day-7',
] as const;

type RouteFeature = GeoJSON.Feature<GeoJSON.LineString>;

const baseRouteCoordinates: GeoJSON.Position[] = [
  [3.8767, 43.6119], // Montpellier
  [3.9272, 43.5675], // Port Marianne area
  [3.9735, 43.5497], // Lattes / Perols area
  [3.983, 43.5485], // Carnon
  [3.9372, 43.5353], // Palavas
  [4.0827, 43.5613], // La Grande-Motte
];

function buildRoute(name: string): RouteFeature {
  return {
    type: 'Feature',
    properties: { name },
    geometry: {
      type: 'LineString',
      coordinates: baseRouteCoordinates,
    },
  };
}

export const trajetsRoutes: Record<TrajetsRouteId, RouteFeature> = {
  'day-1': buildRoute('Route day 1'),
  'day-2': buildRoute('Route day 2'),
  'day-3': buildRoute('Route day 3'),
  'day-4': route20260423,
  'day-5': route20260424,
  'day-6': route20260425,
  'day-7': buildRoute('Route day 7'),
};
