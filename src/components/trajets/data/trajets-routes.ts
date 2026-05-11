import {
  route20260427,
  route20260423,
  route20260424,
  route20260425,
  route20260505,
  route20260507,
  route20260510,
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

export const trajetsRoutes: Record<TrajetsRouteId, RouteFeature> = {
  'day-1': route20260427,
  'day-2': route20260505,
  'day-3': route20260507,
  'day-4': route20260423,
  'day-5': route20260424,
  'day-6': route20260425,
  'day-7': route20260510,
};
