'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl, { type GeoJSONSource, type Map as MapLibreMap } from 'maplibre-gl';

import { useTheme } from '@/context/ThemeContext';
import {
  trajetsRoutes,
  type TrajetsRouteId,
} from '@/components/trajets/data/trajets-routes';
import { trajetsLabels } from '@/components/trajets/data/trajets-labels';

type TrajetsMapProps = {
  activeRouteId: TrajetsRouteId;
  fallbackText: string;
};

const ROUTE_SOURCE_ID = 'trajets-route-source';
const ROUTE_UNDERLAY_LAYER_ID = 'trajets-route-underlay-layer';
const ROUTE_MAIN_LAYER_ID = 'trajets-route-main-layer';
const LABELS_SOURCE_ID = 'trajets-labels-source';
const LABELS_LAYER_ID = 'trajets-labels-layer';

function getStyleUrl(theme: 'light' | 'dark', apiKey: string): string {
  const styleId = theme === 'dark' ? 'dataviz-dark' : 'dataviz-light';
  return `https://api.maptiler.com/maps/${styleId}/style.json?key=${apiKey}`;
}

function ensureRouteLayer(
  map: MapLibreMap,
  route: GeoJSON.Feature<GeoJSON.LineString>,
  resolvedTheme: 'light' | 'dark',
): void {
  const existingSource = map.getSource(ROUTE_SOURCE_ID) as GeoJSONSource | undefined;
  if (!existingSource) {
    map.addSource(ROUTE_SOURCE_ID, {
      type: 'geojson',
      data: route,
    });
  } else {
    existingSource.setData(route);
  }

  if (!map.getLayer(ROUTE_UNDERLAY_LAYER_ID)) {
    map.addLayer({
      id: ROUTE_UNDERLAY_LAYER_ID,
      type: 'line',
      source: ROUTE_SOURCE_ID,
      paint: {
        'line-color': '#38bdf8',
        'line-width': 9,
        'line-opacity': 0.28,
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
    });
  }

  const mainRouteColor = resolvedTheme === 'dark' ? '#38bdf8' : '#0ea5e9';
  if (!map.getLayer(ROUTE_MAIN_LAYER_ID)) {
    map.addLayer({
      id: ROUTE_MAIN_LAYER_ID,
      type: 'line',
      source: ROUTE_SOURCE_ID,
      paint: {
        'line-color': mainRouteColor,
        'line-width': 4,
        'line-opacity': 0.98,
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
    });
  } else {
    map.setPaintProperty(ROUTE_MAIN_LAYER_ID, 'line-color', mainRouteColor);
  }
}

function ensureLabelsLayer(map: MapLibreMap, resolvedTheme: 'light' | 'dark'): void {
  const labelsSource = map.getSource(LABELS_SOURCE_ID) as GeoJSONSource | undefined;
  if (!labelsSource) {
    map.addSource(LABELS_SOURCE_ID, {
      type: 'geojson',
      data: trajetsLabels,
    });
  }

  if (!map.getLayer(LABELS_LAYER_ID)) {
    map.addLayer({
      id: LABELS_LAYER_ID,
      type: 'symbol',
      source: LABELS_SOURCE_ID,
      layout: {
        'text-field': ['get', 'name'],
        'text-size': 11,
        'text-offset': [0, 0.8],
        'text-anchor': 'top',
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-allow-overlap': true,
        'text-ignore-placement': true,
      },
      paint: {
        'text-color': resolvedTheme === 'dark' ? '#e2e8f0' : '#334155',
        'text-halo-color': resolvedTheme === 'dark' ? '#0f172a' : '#ffffff',
        'text-halo-width': 1.2,
      },
    });
  } else {
    map.setPaintProperty(LABELS_LAYER_ID, 'text-color', resolvedTheme === 'dark' ? '#e2e8f0' : '#334155');
    map.setPaintProperty(
      LABELS_LAYER_ID,
      'text-halo-color',
      resolvedTheme === 'dark' ? '#0f172a' : '#ffffff',
    );
    map.setPaintProperty(LABELS_LAYER_ID, 'text-halo-width', 1.2);
  }
}

function fitMapToRoute(
  map: MapLibreMap,
  route: GeoJSON.Feature<GeoJSON.LineString>,
  options: { duration: number },
): void {
  map.fitBounds(getRouteBounds(route), { padding: 36, duration: options.duration });
}

function getRouteBounds(route: GeoJSON.Feature<GeoJSON.LineString>): maplibregl.LngLatBoundsLike {
  const [firstLon, firstLat] = route.geometry.coordinates[0];
  let minLon = firstLon;
  let maxLon = firstLon;
  let minLat = firstLat;
  let maxLat = firstLat;

  for (const [lon, lat] of route.geometry.coordinates) {
    minLon = Math.min(minLon, lon);
    maxLon = Math.max(maxLon, lon);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }

  return [
    [minLon, minLat],
    [maxLon, maxLat],
  ];
}

export function TrajetsMap({ activeRouteId, fallbackText }: TrajetsMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
  const { resolvedTheme } = useTheme();
  const activeRoute = useMemo(() => trajetsRoutes[activeRouteId], [activeRouteId]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const activeRouteRef = useRef(activeRoute);
  const [mapReady, setMapReady] = useState(false);
  const [hasMapError, setHasMapError] = useState(false);

  useEffect(() => {
    activeRouteRef.current = activeRoute;
  }, [activeRoute]);

  useEffect(() => {
    if (!apiKey || !containerRef.current || mapRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: getStyleUrl(resolvedTheme, apiKey),
        attributionControl: false,
      });

      mapRef.current = map;
      map.scrollZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();

      const onLoad = () => {
        if (!map.isStyleLoaded()) return;
        ensureRouteLayer(map, activeRoute, resolvedTheme);
        ensureLabelsLayer(map, resolvedTheme);
        fitMapToRoute(map, activeRoute, { duration: 350 });
        setMapReady(true);
      };

      map.on('load', onLoad);
      map.on('error', () => setHasMapError(true));

      return () => {
        map.off('load', onLoad);
        map.remove();
        mapRef.current = null;
      };
    } catch {
      setHasMapError(true);
      return undefined;
    }
  }, [activeRoute, apiKey, resolvedTheme]);

  useEffect(() => {
    if (!mapRef.current || !mapReady || !apiKey) return;
    const map = mapRef.current;
    const onStyleLoad = () => {
      if (!map.isStyleLoaded()) return;
      ensureRouteLayer(map, activeRouteRef.current, resolvedTheme);
      ensureLabelsLayer(map, resolvedTheme);
      fitMapToRoute(map, activeRouteRef.current, { duration: 350 });
    };

    map.once('style.load', onStyleLoad);
    map.setStyle(getStyleUrl(resolvedTheme, apiKey));

    return () => {
      map.off('style.load', onStyleLoad);
    };
  }, [apiKey, mapReady, resolvedTheme]);

  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    if (!mapRef.current.isStyleLoaded()) return;
    ensureRouteLayer(mapRef.current, activeRoute, resolvedTheme);
    ensureLabelsLayer(mapRef.current, resolvedTheme);
    fitMapToRoute(mapRef.current, activeRoute, { duration: 350 });
  }, [activeRoute, mapReady, resolvedTheme]);

  const handleZoomIn = () => {
    if (!mapRef.current) return;
    mapRef.current.zoomIn({ duration: 250 });
  };

  const handleZoomOut = () => {
    if (!mapRef.current) return;
    mapRef.current.zoomOut({ duration: 250 });
  };

  const handleResetRouteView = () => {
    if (!mapRef.current || !mapReady) return;
    if (!mapRef.current.isStyleLoaded()) return;
    fitMapToRoute(mapRef.current, activeRouteRef.current, { duration: 350 });
  };

  if (!apiKey || hasMapError) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <p className="text-sm text-slate-600 dark:text-slate-300">{fallbackText}</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full rounded-xl" aria-label="Trajets map" />
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
        <button
          type="button"
          aria-label="Zoom in"
          onClick={handleZoomIn}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-white/90 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800/90"
        >
          +
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          onClick={handleZoomOut}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-white/90 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800/90"
        >
          -
        </button>
        <button
          type="button"
          aria-label="Reset route view"
          onClick={handleResetRouteView}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-white/90 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800/90"
        >
          ⟳
        </button>
      </div>
    </div>
  );
}

