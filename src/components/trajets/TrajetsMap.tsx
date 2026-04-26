'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import maplibregl, { type GeoJSONSource, type Map as MapLibreMap } from 'maplibre-gl';

import { useTheme } from '@/context/ThemeContext';
import {
  trajetsRoutes,
  type TrajetsRouteId,
} from '@/components/trajets/data/trajets-routes';

type TrajetsMapProps = {
  activeRouteId: TrajetsRouteId;
  fallbackText: string;
};

const ROUTE_SOURCE_ID = 'trajets-route-source';
const ROUTE_UNDERLAY_LAYER_ID = 'trajets-route-underlay-layer';
const ROUTE_MAIN_LAYER_ID = 'trajets-route-main-layer';
const ROUTE_CHANGE_FIT_DURATION_MS = 160;
const RESET_FIT_DURATION_MS = 220;

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
  const selectedRouteIdRef = useRef(activeRouteId);
  const resolvedThemeRef = useRef(resolvedTheme);
  const appliedThemeRef = useRef<'light' | 'dark' | null>(null);
  const activeRouteIdRef = useRef<TrajetsRouteId | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [hasMapError, setHasMapError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMapTransitioning, setIsMapTransitioning] = useState(false);

  useEffect(() => {
    activeRouteRef.current = activeRoute;
    selectedRouteIdRef.current = activeRouteId;
  }, [activeRoute, activeRouteId]);

  useEffect(() => {
    resolvedThemeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    if (!apiKey || !containerRef.current || mapRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: getStyleUrl(resolvedThemeRef.current, apiKey),
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
        ensureRouteLayer(map, activeRouteRef.current, resolvedThemeRef.current);
        fitMapToRoute(map, activeRouteRef.current, { duration: 0 });
        appliedThemeRef.current = resolvedThemeRef.current;
        activeRouteIdRef.current = selectedRouteIdRef.current;
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
  }, [apiKey]);

  useEffect(() => {
    if (!mapRef.current || !mapReady || !apiKey) return;
    const map = mapRef.current;
    if (appliedThemeRef.current === resolvedTheme) {
      if (map.isStyleLoaded()) {
        ensureRouteLayer(map, activeRouteRef.current, resolvedTheme);
      }
      return;
    }

    const onStyleLoad = () => {
      if (!map.isStyleLoaded()) return;
      ensureRouteLayer(map, activeRouteRef.current, resolvedTheme);
      fitMapToRoute(map, activeRouteRef.current, { duration: 0 });
      appliedThemeRef.current = resolvedTheme;
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
    const hasRouteLayer =
      mapRef.current.getSource(ROUTE_SOURCE_ID) !== undefined &&
      mapRef.current.getLayer(ROUTE_MAIN_LAYER_ID) !== undefined;
    if (activeRouteIdRef.current === activeRouteId && hasRouteLayer) return;
    activeRouteIdRef.current = activeRouteId;
    mapRef.current.stop();
    ensureRouteLayer(mapRef.current, activeRoute, resolvedTheme);
    fitMapToRoute(mapRef.current, activeRoute, { duration: ROUTE_CHANGE_FIT_DURATION_MS });
  }, [activeRoute, activeRouteId, mapReady, resolvedTheme]);

  useEffect(() => {
    if (!mapRef.current) return;

    const resizeMap = () => {
      mapRef.current?.resize();
    };

    const animationFrame = window.requestAnimationFrame(resizeMap);
    const resizeTimeout = window.setTimeout(() => {
      resizeMap();
      if (mapRef.current?.isStyleLoaded()) {
        fitMapToRoute(mapRef.current, activeRouteRef.current, { duration: RESET_FIT_DURATION_MS });
      }
    }, 320);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(resizeTimeout);
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!isMapTransitioning) return;
    const transitionTimeout = window.setTimeout(() => setIsMapTransitioning(false), 300);

    return () => {
      window.clearTimeout(transitionTimeout);
    };
  }, [isMapTransitioning]);

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
    mapRef.current.stop();
    fitMapToRoute(mapRef.current, activeRouteRef.current, { duration: RESET_FIT_DURATION_MS });
  };

  const handleToggleFullscreen = () => {
    setIsMapTransitioning(true);
    setIsFullscreen((current) => !current);
  };

  if (!apiKey || hasMapError) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <p className="text-sm text-slate-600 dark:text-slate-300">{fallbackText}</p>
      </div>
    );
  }

  return (
    <div
      className={
        isFullscreen
          ? `fixed inset-3 z-[80] h-auto w-auto transform-gpu rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl transition-[opacity,transform,border-radius] duration-300 ease-out md:inset-6 dark:border-slate-700 dark:bg-slate-950 ${
              isMapTransitioning ? 'scale-[0.985] opacity-95' : 'scale-100 opacity-100'
            }`
          : `relative h-full w-full transform-gpu transition-[opacity,transform,border-radius] duration-300 ease-out ${
              isMapTransitioning ? 'scale-[0.985] opacity-95' : 'scale-100 opacity-100'
            }`
      }
    >
      <div
        ref={containerRef}
        className="h-full w-full rounded-xl transition-[border-radius] duration-300 ease-out"
        aria-label="Trajets map"
      />
      <div
        className={
          isFullscreen
            ? 'absolute bottom-3 right-3 z-10 flex flex-col gap-2 md:bottom-auto md:right-3 md:top-3'
            : 'absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 flex-row gap-2 md:bottom-auto md:left-auto md:right-3 md:top-3 md:translate-x-0 md:flex-col'
        }
      >
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
        <button
          type="button"
          aria-label={isFullscreen ? 'Return to compact map view' : 'Open map in fullscreen'}
          onClick={handleToggleFullscreen}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-white/90 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-800/90"
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" aria-hidden />
          ) : (
            <Maximize2 className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}
