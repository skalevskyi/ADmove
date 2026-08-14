'use client';

import { Maximize2, Minimize2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { GeoJSONSource, LngLatBoundsLike, Map as MapLibreMap } from 'maplibre-gl';

import { useTheme } from '@/context/ThemeContext';
import {
  trajetsRoutes,
  type TrajetsRouteId,
} from '@/components/trajets/data/trajets-routes';

type TrajetsMapProps = {
  activeRouteId: TrajetsRouteId;
  fallbackText: string;
  showRoute?: boolean;
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

function removeRouteLayer(map: MapLibreMap): void {
  if (map.getLayer(ROUTE_MAIN_LAYER_ID)) {
    map.removeLayer(ROUTE_MAIN_LAYER_ID);
  }
  if (map.getLayer(ROUTE_UNDERLAY_LAYER_ID)) {
    map.removeLayer(ROUTE_UNDERLAY_LAYER_ID);
  }
  if (map.getSource(ROUTE_SOURCE_ID)) {
    map.removeSource(ROUTE_SOURCE_ID);
  }
}

function fitMapToRoute(
  map: MapLibreMap,
  route: GeoJSON.Feature<GeoJSON.LineString>,
  options: { duration: number },
): void {
  map.fitBounds(getRouteBounds(route), { padding: 36, duration: options.duration });
}

function getRouteBounds(route: GeoJSON.Feature<GeoJSON.LineString>): LngLatBoundsLike {
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

export function TrajetsMap({ activeRouteId, fallbackText, showRoute = true }: TrajetsMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;
  const { resolvedTheme } = useTheme();
  const activeRoute = useMemo(() => trajetsRoutes[activeRouteId], [activeRouteId]);
  const viewportTriggerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const activeRouteRef = useRef(activeRoute);
  const selectedRouteIdRef = useRef(activeRouteId);
  const showRouteRef = useRef(showRoute);
  const resolvedThemeRef = useRef(resolvedTheme);
  const appliedThemeRef = useRef<'light' | 'dark' | null>(null);
  const targetStyleUrlRef = useRef<string | null>(null);
  const styleRequestIdRef = useRef(0);
  const activeRouteIdRef = useRef<TrajetsRouteId | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [hasMapError, setHasMapError] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMapTransitioning, setIsMapTransitioning] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    activeRouteRef.current = activeRoute;
    selectedRouteIdRef.current = activeRouteId;
    showRouteRef.current = showRoute;
  }, [activeRoute, activeRouteId, showRoute]);

  useEffect(() => {
    resolvedThemeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    if (!hasMounted || !viewportTriggerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px 0px' },
    );

    observer.observe(viewportTriggerRef.current);
    return () => observer.disconnect();
  }, [hasMounted]);

  useEffect(() => {
    if (!apiKey || !hasMounted || !isInViewport || !containerRef.current || mapRef.current) return;
    let isDisposed = false;
    let initializedMap: MapLibreMap | null = null;
    let onLoad: (() => void) | null = null;

    const initMap = async () => {
      try {
        const maplibreModule = await import('maplibre-gl');
        if (isDisposed || !containerRef.current || mapRef.current) return;

        const initialStyleUrl = getStyleUrl(resolvedThemeRef.current, apiKey);
        targetStyleUrlRef.current = initialStyleUrl;
        const map = new maplibreModule.default.Map({
          container: containerRef.current,
          style: initialStyleUrl,
          attributionControl: false,
        });

        initializedMap = map;
        mapRef.current = map;
        map.scrollZoom.disable();
        map.doubleClickZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        map.dragRotate.disable();
        map.touchZoomRotate.disableRotation();

        onLoad = () => {
          setHasMapError(false);
          if (showRouteRef.current) {
            ensureRouteLayer(map, activeRouteRef.current, resolvedThemeRef.current);
            fitMapToRoute(map, activeRouteRef.current, { duration: 0 });
          }
          appliedThemeRef.current = resolvedThemeRef.current;
          activeRouteIdRef.current = selectedRouteIdRef.current;
          setMapReady(true);
        };

        map.on('load', onLoad);
        map.on('error', () => {
          // Runtime style/tile errors can be transient during theme/style switching.
          // Keep fallback reserved for missing API key or true initialization failure.
        });
      } catch {
        if (!isDisposed) {
          setHasMapError(true);
        }
      }
    };

    void initMap();

    return () => {
      isDisposed = true;
      if (initializedMap && onLoad) {
        initializedMap.off('load', onLoad);
      }
      initializedMap?.remove();
      mapRef.current = null;
    };
  }, [apiKey, hasMounted, isInViewport]);

  useEffect(() => {
    if (!mapRef.current || !mapReady || !apiKey) return;
    const map = mapRef.current;
    const targetStyleUrl = getStyleUrl(resolvedTheme, apiKey);
    if (targetStyleUrlRef.current === targetStyleUrl) {
      if (map.isStyleLoaded()) {
        if (showRouteRef.current) {
          ensureRouteLayer(map, activeRouteRef.current, resolvedTheme);
        } else {
          removeRouteLayer(map);
        }
        appliedThemeRef.current = resolvedTheme;
      }
      return;
    }
    targetStyleUrlRef.current = targetStyleUrl;
    styleRequestIdRef.current += 1;
    const requestId = styleRequestIdRef.current;
    let didRestoreForRequest = false;

    const restoreRouteForCurrentStyle = (options: { allowFit: boolean; force: boolean }): boolean => {
      if (requestId !== styleRequestIdRef.current) return false;
      if (!mapRef.current || mapRef.current !== map) return false;
      if (!map.isStyleLoaded()) return false;

      const routeToApply = activeRouteRef.current;
      if (!routeToApply) return false;

      if (!showRouteRef.current) {
        removeRouteLayer(map);
        appliedThemeRef.current = resolvedTheme;
        activeRouteIdRef.current = selectedRouteIdRef.current;
        didRestoreForRequest = true;
        return true;
      }

      const hasRouteSource = map.getSource(ROUTE_SOURCE_ID) !== undefined;
      const hasMainRouteLayer = map.getLayer(ROUTE_MAIN_LAYER_ID) !== undefined;
      const hasUnderlayRouteLayer = map.getLayer(ROUTE_UNDERLAY_LAYER_ID) !== undefined;
      const needsReapply =
        !hasRouteSource ||
        !hasMainRouteLayer ||
        !hasUnderlayRouteLayer ||
        appliedThemeRef.current !== resolvedTheme;

      if (!options.force && !needsReapply) return false;

      setHasMapError(false);
      ensureRouteLayer(map, routeToApply, resolvedTheme);
      if (options.allowFit) {
        fitMapToRoute(map, routeToApply, { duration: 0 });
      }
      appliedThemeRef.current = resolvedTheme;
      activeRouteIdRef.current = selectedRouteIdRef.current;
      didRestoreForRequest = true;
      return true;
    };

    const onStyleLoad = () => {
      if (restoreRouteForCurrentStyle({ allowFit: true, force: true })) {
        map.off('styledata', onStyleData);
        map.off('idle', onIdle);
      }
    };

    const onStyleData = () => {
      if (!didRestoreForRequest && restoreRouteForCurrentStyle({ allowFit: false, force: false })) {
        map.off('styledata', onStyleData);
        map.off('idle', onIdle);
      }
    };

    const onIdle = () => {
      if (!didRestoreForRequest && restoreRouteForCurrentStyle({ allowFit: false, force: false })) {
        map.off('styledata', onStyleData);
        map.off('idle', onIdle);
      }
    };

    map.once('style.load', onStyleLoad);
    map.on('styledata', onStyleData);
    map.on('idle', onIdle);
    map.setStyle(targetStyleUrl);

    return () => {
      map.off('style.load', onStyleLoad);
      map.off('styledata', onStyleData);
      map.off('idle', onIdle);
    };
  }, [apiKey, mapReady, resolvedTheme]);

  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    if (!mapRef.current.isStyleLoaded()) return;
    const hasRouteLayer =
      mapRef.current.getSource(ROUTE_SOURCE_ID) !== undefined &&
      mapRef.current.getLayer(ROUTE_MAIN_LAYER_ID) !== undefined;
    if (!showRoute) {
      removeRouteLayer(mapRef.current);
      activeRouteIdRef.current = activeRouteId;
      return;
    }
    if (activeRouteIdRef.current === activeRouteId && hasRouteLayer) return;
    activeRouteIdRef.current = activeRouteId;
    mapRef.current.stop();
    ensureRouteLayer(mapRef.current, activeRoute, resolvedTheme);
    fitMapToRoute(mapRef.current, activeRoute, { duration: ROUTE_CHANGE_FIT_DURATION_MS });
  }, [activeRoute, activeRouteId, mapReady, resolvedTheme, showRoute]);

  useEffect(() => {
    if (!mapRef.current) return;

    const resizeMap = () => {
      mapRef.current?.resize();
    };

    const animationFrame = window.requestAnimationFrame(resizeMap);
    const resizeTimeout = window.setTimeout(() => {
      resizeMap();
      if (showRouteRef.current && mapRef.current?.isStyleLoaded()) {
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
      ref={viewportTriggerRef}
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
      {!mapReady ? (
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-slate-100/80 via-slate-50/70 to-slate-100/80 dark:from-slate-900/70 dark:via-slate-900/40 dark:to-slate-900/70" />
      ) : null}
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
