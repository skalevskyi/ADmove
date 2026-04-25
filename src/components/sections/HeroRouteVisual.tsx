'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { BASE_PATH } from '@/lib/base-path';

type Direction = 'outbound' | 'return';

type StopId = 'montpellier' | 'portMarianne' | 'carnon' | 'grandeMotte' | 'palavas';
type VisualStopId =
  | 'montpellier'
  | 'portMarianne'
  | 'carnonOutbound'
  | 'grandeMotte'
  | 'carnonReturn'
  | 'palavas';
type MotionAnchorId =
  | 'montpellier'
  | 'portMarianne'
  | 'carnonOutbound'
  | 'grandeMotte'
  | 'carnonReturn'
  | 'palavas';
type TrailPhase = 'hidden' | 'growing' | 'following' | 'collapsing';

type HeroRouteVisualProps = {
  reducedMotion: boolean;
  imageAlt: string;
  routeAriaLabel: string;
  vehicleAriaLabel: string;
  locations: Record<StopId, string>;
};

const OUTBOUND: readonly StopId[] = ['montpellier', 'portMarianne', 'carnon', 'grandeMotte'];
const RETURN: readonly StopId[] = ['grandeMotte', 'carnon', 'palavas', 'montpellier'];

const STEP_MS = 3200;
const ROUTE_PATH_D =
  'M 12 50 C 12 39, 20 33, 34 33 H 66 C 80 33, 88 39, 88 50 C 88 61, 80 67, 66 67 H 34 C 20 67, 12 61, 12 50 Z';
const TOP_LABEL_OFFSET = 4.2;
const BOTTOM_LABEL_OFFSET = 4.2;
const LEFT_ENDPOINT_LABEL_OFFSET = 4.2;
const RIGHT_ENDPOINT_LABEL_OFFSET = 4.2;
const ROUTE_TRAIL_LENGTH = 12;
const TRAIL_SAMPLE_COUNT = 32;
const TRAIL_SEGMENT_COUNT = 18;
const TRAIL_HIDDEN_EPSILON = 0.05;
const TRAIL_CATCHUP_MULTIPLIER = 2;
const TRAIL_MOVEMENT_EPSILON = 0.0005;
const TRAIL_OPACITY_MIN = 0.04;
const TRAIL_OPACITY_MAX = 0.82;
const TRAIL_OPACITY_POWER = 1.6;
const TOKEN_ROUTE_BASE = 'var(--hero-route-base)';
const TOKEN_ROUTE_TRAIL = 'var(--hero-route-trail)';
const TOKEN_MARKER_FILL = 'var(--hero-marker-fill)';
const TOKEN_MARKER_STROKE = 'var(--hero-marker-stroke)';
const TOKEN_LABEL_FILL = 'var(--hero-label-fill)';
const TOKEN_LABEL_STROKE = 'var(--hero-label-stroke)';
const TOKEN_VEHICLE_SHADOW = 'var(--hero-vehicle-shadow)';
const TOKEN_VEHICLE_BODY = 'var(--hero-vehicle-body)';
const TOKEN_VEHICLE_CABIN = 'var(--hero-vehicle-cabin)';
const TOKEN_VEHICLE_GLASS = 'var(--hero-vehicle-glass)';
const TOKEN_VEHICLE_WHEEL = 'var(--hero-vehicle-wheel)';
const TOKEN_VEHICLE_WHEEL_CENTER = 'var(--hero-vehicle-wheel-center)';
const MAP_LIGHT_SRC = `${BASE_PATH}/hero/locations/map-light.png`;
const MAP_DARK_SRC = `${BASE_PATH}/hero/locations/map-dark.png`;

const STOP_POINTS: Record<StopId, { x: number; y: number }> = {
  montpellier: { x: 12, y: 50 },
  portMarianne: { x: 36, y: 33 },
  carnon: { x: 66, y: 33 },
  grandeMotte: { x: 88, y: 50 },
  palavas: { x: 36, y: 67 },
};

const MOTION_ANCHOR_POINTS: Record<MotionAnchorId, { x: number; y: number }> = {
  montpellier: { x: 12, y: 50 },
  portMarianne: { x: 36, y: 33 },
  carnonOutbound: { x: 66, y: 33 },
  grandeMotte: { x: 88, y: 50 },
  carnonReturn: { x: 66, y: 67 },
  palavas: { x: 36, y: 67 },
};

const VISUAL_STOPS: readonly {
  visualId: VisualStopId;
  logicalStop: StopId;
  x: number;
  y: number;
  labelOffsetY: number;
}[] = [
  { visualId: 'montpellier', logicalStop: 'montpellier', x: 12, y: 50, labelOffsetY: -17 },
  { visualId: 'portMarianne', logicalStop: 'portMarianne', x: 36, y: 33, labelOffsetY: -17 },
  { visualId: 'carnonOutbound', logicalStop: 'carnon', x: 66, y: 33, labelOffsetY: -17 },
  { visualId: 'grandeMotte', logicalStop: 'grandeMotte', x: 88, y: 50, labelOffsetY: -17 },
  { visualId: 'carnonReturn', logicalStop: 'carnon', x: 66, y: 67, labelOffsetY: 11 },
  { visualId: 'palavas', logicalStop: 'palavas', x: 36, y: 67, labelOffsetY: 11 },
] as const;
const LABEL_ANCHOR_POINTS: Record<VisualStopId, { x: number; y: number }> = {
  montpellier: { x: 12 - LEFT_ENDPOINT_LABEL_OFFSET, y: 50 },
  portMarianne: { x: 36, y: 33 - TOP_LABEL_OFFSET },
  carnonOutbound: { x: 66, y: 33 - TOP_LABEL_OFFSET },
  grandeMotte: { x: 88 + RIGHT_ENDPOINT_LABEL_OFFSET, y: 50 },
  carnonReturn: { x: 66, y: 67 + BOTTOM_LABEL_OFFSET },
  palavas: { x: 36, y: 67 + BOTTOM_LABEL_OFFSET },
};
const LABEL_PROXIMITY_RADIUS = 8;
const LABEL_ACTIVE_SCALE = 1.12;
const LABEL_PROXIMITY_TRANSFORMS: Record<VisualStopId, { dx: number; dy: number }> = {
  montpellier: { dx: -1.4, dy: 0 },
  portMarianne: { dx: 0, dy: -1.2 },
  carnonOutbound: { dx: 0, dy: -1.2 },
  grandeMotte: { dx: 1.4, dy: 0 },
  carnonReturn: { dx: 0, dy: 1.2 },
  palavas: { dx: 0, dy: 1.2 },
};

function getStops(direction: Direction): readonly StopId[] {
  return direction === 'outbound' ? OUTBOUND : RETURN;
}

function getMotionAnchorId(stop: StopId, direction: Direction): MotionAnchorId {
  if (stop !== 'carnon') return stop;
  return direction === 'outbound' ? 'carnonOutbound' : 'carnonReturn';
}

export function HeroRouteVisual({
  reducedMotion,
  imageAlt,
  routeAriaLabel,
  vehicleAriaLabel,
  locations,
}: HeroRouteVisualProps) {
  const [state, setState] = useState<{ direction: Direction; index: number; changedAt: number }>(() => ({
    direction: 'outbound',
    index: 0,
    changedAt: Date.now(),
  }));
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [motionAnchorLengths, setMotionAnchorLengths] = useState<Record<MotionAnchorId, number> | null>(
    null,
  );
  const routePathRef = useRef<SVGPathElement | null>(null);
  const trailHeadRef = useRef(0);
  const trailTailRef = useRef(0);
  const trailVisibleLengthRef = useRef(0);
  const previousDirectionRef = useRef<Direction>('outbound');
  const previousTickMsRef = useRef<number | null>(null);
  const previousCurrentLengthRef = useRef<number | null>(null);
  const trailDirectionSignRef = useRef<1 | -1>(1);
  const trailPhaseRef = useRef<TrailPhase>('hidden');
  const vehicleRef = useRef<SVGGElement | null>(null);
  const vehicleFlipRef = useRef<SVGGElement | null>(null);
  const trailSegmentRefs = useRef<Array<SVGLineElement | null>>([]);
  const labelTextRefs = useRef<Record<VisualStopId, SVGTextElement | null>>({
    montpellier: null,
    portMarianne: null,
    carnonOutbound: null,
    grandeMotte: null,
    carnonReturn: null,
    palavas: null,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setState((prev) => {
        const currentStops = getStops(prev.direction);
        const nextIndex = prev.index + 1;
        if (nextIndex < currentStops.length) {
          return { ...prev, index: nextIndex, changedAt: Date.now() };
        }
        return {
          direction: prev.direction === 'outbound' ? 'return' : 'outbound',
          index: 0,
          changedAt: Date.now(),
        };
      });
    }, STEP_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    let frameId = 0;
    let lastStateUpdateMs = 0;
    const NOW_UPDATE_INTERVAL_MS = 80;
    const tick = () => {
      const nextNow = Date.now();
      if (nextNow - lastStateUpdateMs >= NOW_UPDATE_INTERVAL_MS) {
        lastStateUpdateMs = nextNow;
        setNowMs(nextNow);
      }
      frameId = window.requestAnimationFrame(tick);
    };
    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [reducedMotion]);

  useEffect(() => {
    const path = routePathRef.current;
    if (!path) return;
    const totalLength = path.getTotalLength();
    const COARSE_STEPS = 1200;
    const FINE_STEPS = 240;
    const coarseStepLength = totalLength / COARSE_STEPS;

    const nearestLengthByStop = (Object.keys(MOTION_ANCHOR_POINTS) as MotionAnchorId[]).reduce<
      Record<MotionAnchorId, number>
    >(
      (acc, anchorId) => {
        const target = MOTION_ANCHOR_POINTS[anchorId];
        let bestLength = 0;
        let bestDistance = Number.POSITIVE_INFINITY;

        for (let step = 0; step <= COARSE_STEPS; step += 1) {
          const candidateLength = (totalLength * step) / COARSE_STEPS;
          const point = path.getPointAtLength(candidateLength);
          const dx = point.x - target.x;
          const dy = point.y - target.y;
          const distance = dx * dx + dy * dy;
          if (distance < bestDistance) {
            bestDistance = distance;
            bestLength = candidateLength;
          }
        }

        const searchStart = Math.max(0, bestLength - coarseStepLength);
        const searchEnd = Math.min(totalLength, bestLength + coarseStepLength);
        for (let step = 0; step <= FINE_STEPS; step += 1) {
          const candidateLength = searchStart + ((searchEnd - searchStart) * step) / FINE_STEPS;
          const point = path.getPointAtLength(candidateLength);
          const dx = point.x - target.x;
          const dy = point.y - target.y;
          const distance = dx * dx + dy * dy;
          if (distance < bestDistance) {
            bestDistance = distance;
            bestLength = candidateLength;
          }
        }

        acc[anchorId] = bestLength;
        return acc;
      },
      {} as Record<MotionAnchorId, number>,
    );

    setMotionAnchorLengths(nearestLengthByStop);
  }, []);

  const activeStops = getStops(state.direction);
  const activeStop = activeStops[state.index];
  const nextStop = activeStops[state.index + 1] ?? activeStop;
  const activeMotionAnchor = getMotionAnchorId(activeStop, state.direction);
  const nextMotionAnchor = getMotionAnchorId(nextStop, state.direction);
  const segmentProgressRaw = (nowMs - state.changedAt) / STEP_MS;
  const segmentProgress = reducedMotion ? 1 : Math.min(Math.max(segmentProgressRaw, 0), 1);
  const activeLabel = locations[activeStop];
  const totalPathLength = routePathRef.current?.getTotalLength() ?? 0;

  const vehiclePosition = useMemo(() => {
    const fallbackPoint = MOTION_ANCHOR_POINTS[activeMotionAnchor];
    const path = routePathRef.current;
    if (!path || !motionAnchorLengths || totalPathLength <= 0) {
      return { ...fallbackPoint, currentLength: null as number | null };
    }

    const startLength = motionAnchorLengths[activeMotionAnchor];
    const endLength = motionAnchorLengths[nextMotionAnchor];

    if (activeMotionAnchor === nextMotionAnchor) {
      const stationary = path.getPointAtLength(startLength);
      return { x: stationary.x, y: stationary.y, currentLength: startLength };
    }

    // Traverse along the actual SVG path order from current anchor to next anchor.
    // This keeps outbound and return aligned with the same geometric loop direction.
    const forwardDistance =
      endLength >= startLength ? endLength - startLength : totalPathLength - startLength + endLength;
    const currentLength = (startLength + forwardDistance * segmentProgress) % totalPathLength;
    const point = path.getPointAtLength(currentLength);
    return { x: point.x, y: point.y, currentLength };
  }, [activeMotionAnchor, nextMotionAnchor, segmentProgress, motionAnchorLengths, totalPathLength]);

  useEffect(() => {
    if (reducedMotion) return;
    let frameId = 0;
    const hideTrailSegments = () => {
      for (let i = 0; i < TRAIL_SEGMENT_COUNT; i += 1) {
        const segmentEl = trailSegmentRefs.current[i];
        if (!segmentEl) continue;
        segmentEl.setAttribute('opacity', '0');
      }
    };

    const tick = () => {
      const path = routePathRef.current;
      if (!path || !motionAnchorLengths || totalPathLength <= 0) {
        hideTrailSegments();
        frameId = window.requestAnimationFrame(tick);
        return;
      }

      const now = Date.now();
      const segmentProgressRaw = (now - state.changedAt) / STEP_MS;
      const segmentProgress = Math.min(Math.max(segmentProgressRaw, 0), 1);
      const startLength = motionAnchorLengths[activeMotionAnchor];
      const endLength = motionAnchorLengths[nextMotionAnchor];
      const currentLengthForVehicle =
        activeMotionAnchor === nextMotionAnchor
          ? startLength
          : (startLength +
              (endLength >= startLength
                ? endLength - startLength
                : totalPathLength - startLength + endLength) *
                segmentProgress) %
            totalPathLength;
      const point = path.getPointAtLength(currentLengthForVehicle);

      if (vehicleRef.current) {
        vehicleRef.current.setAttribute('transform', `translate(${point.x} ${point.y})`);
      }

      if (vehicleFlipRef.current) {
        const scaleX = state.direction === 'outbound' ? -1 : 1;
        vehicleFlipRef.current.setAttribute('transform', `scale(${scaleX} 1)`);
      }
      VISUAL_STOPS.forEach((stop) => {
        const labelEl = labelTextRefs.current[stop.visualId];
        if (!labelEl) {
          return;
        }
        const markerDx = point.x - stop.x;
        const markerDy = point.y - stop.y;
        const isNearMarker =
          markerDx * markerDx + markerDy * markerDy <= LABEL_PROXIMITY_RADIUS * LABEL_PROXIMITY_RADIUS;
        const proximityTransform = LABEL_PROXIMITY_TRANSFORMS[stop.visualId];
        labelEl.style.transform = isNearMarker
          ? `translate(${proximityTransform.dx}px, ${proximityTransform.dy}px) scale(${LABEL_ACTIVE_SCALE})`
          : 'translate(0px, 0px) scale(1)';
      });

      const normalize = (length: number) =>
        ((length % totalPathLength) + totalPathLength) % totalPathLength;
      const signedDelta = (from: number, to: number) => {
        let delta = to - from;
        if (delta > totalPathLength / 2) delta -= totalPathLength;
        if (delta < -totalPathLength / 2) delta += totalPathLength;
        return delta;
      };

      const normalizedCurrent = normalize(currentLengthForVehicle);
      const previousTick = previousTickMsRef.current ?? now;
      const elapsedMs = Math.max(now - previousTick, 0);
      previousTickMsRef.current = now;

      const directionChanged = previousDirectionRef.current !== state.direction;
      previousDirectionRef.current = state.direction;
      if (directionChanged) {
        trailPhaseRef.current = 'hidden';
        trailHeadRef.current = normalizedCurrent;
        trailTailRef.current = normalizedCurrent;
        trailVisibleLengthRef.current = 0;
        trailDirectionSignRef.current = 1;
        previousCurrentLengthRef.current = normalizedCurrent;
        hideTrailSegments();
      }

      const previousCurrent = previousCurrentLengthRef.current ?? normalizedCurrent;
      const movementDelta = signedDelta(previousCurrent, normalizedCurrent);
      previousCurrentLengthRef.current = normalizedCurrent;

      const isMoving = activeMotionAnchor !== nextMotionAnchor;
      const isActuallyMoving = isMoving && Math.abs(movementDelta) > TRAIL_MOVEMENT_EPSILON;
      if (isActuallyMoving) {
        const actualDirectionSign: 1 | -1 = movementDelta > 0 ? 1 : -1;
        if (trailDirectionSignRef.current !== actualDirectionSign) {
          trailHeadRef.current = normalizedCurrent;
          trailTailRef.current = normalizedCurrent;
          trailVisibleLengthRef.current = 0;
          trailDirectionSignRef.current = actualDirectionSign;
        }
        trailDirectionSignRef.current = actualDirectionSign;
      }
      const movementSign = trailDirectionSignRef.current;

      trailHeadRef.current = normalizedCurrent;
      let nextVisibleLength = trailVisibleLengthRef.current;
      let nextPhase = trailPhaseRef.current;

      if (isActuallyMoving) {
        if (nextPhase === 'hidden' || nextPhase === 'collapsing') {
          nextPhase = 'growing';
        }

        if (nextPhase === 'growing') {
          nextVisibleLength = Math.min(ROUTE_TRAIL_LENGTH, nextVisibleLength + Math.abs(movementDelta));
          if (nextVisibleLength >= ROUTE_TRAIL_LENGTH - TRAIL_HIDDEN_EPSILON) {
            nextVisibleLength = ROUTE_TRAIL_LENGTH;
            nextPhase = 'following';
          }
        } else {
          nextVisibleLength = ROUTE_TRAIL_LENGTH;
          nextPhase = 'following';
        }
      } else {
        if (nextPhase === 'growing' || nextPhase === 'following') {
          nextPhase = 'collapsing';
        }

        if (nextPhase === 'collapsing') {
          const catchupSpeed = (ROUTE_TRAIL_LENGTH / STEP_MS) * elapsedMs * TRAIL_CATCHUP_MULTIPLIER;
          nextVisibleLength = Math.max(0, nextVisibleLength - catchupSpeed);
          if (nextVisibleLength <= TRAIL_HIDDEN_EPSILON) {
            nextVisibleLength = 0;
            nextPhase = 'hidden';
          }
        } else if (nextPhase === 'hidden') {
          nextVisibleLength = 0;
        }
      }

      trailPhaseRef.current = nextPhase;
      trailVisibleLengthRef.current = nextVisibleLength;
      trailTailRef.current = normalize(trailHeadRef.current - movementSign * nextVisibleLength);

      if (nextPhase === 'hidden' || nextVisibleLength <= TRAIL_HIDDEN_EPSILON) {
        hideTrailSegments();
      } else {
        const sampleCount = TRAIL_SEGMENT_COUNT;
        const pointsX = new Array<number>(sampleCount + 1);
        const pointsY = new Array<number>(sampleCount + 1);

        for (let i = 0; i <= sampleCount; i += 1) {
          const distanceBehindHead = (nextVisibleLength * i) / sampleCount;
          const sampleLength = trailHeadRef.current - movementSign * distanceBehindHead;
          const normalizedSampleLength = normalize(sampleLength);
          const samplePoint = path.getPointAtLength(normalizedSampleLength);
          pointsX[i] = samplePoint.x;
          pointsY[i] = samplePoint.y;
        }

        for (let i = 0; i < sampleCount; i += 1) {
          const segmentEl = trailSegmentRefs.current[i];
          if (!segmentEl) continue;
          const strength = 1 - i / sampleCount;
          const opacity =
            TRAIL_OPACITY_MIN + (TRAIL_OPACITY_MAX - TRAIL_OPACITY_MIN) * Math.pow(strength, TRAIL_OPACITY_POWER);
          segmentEl.setAttribute('x1', `${pointsX[i]}`);
          segmentEl.setAttribute('y1', `${pointsY[i]}`);
          segmentEl.setAttribute('x2', `${pointsX[i + 1]}`);
          segmentEl.setAttribute('y2', `${pointsY[i + 1]}`);
          segmentEl.setAttribute('opacity', `${opacity}`);
        }
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [
    reducedMotion,
    state.direction,
    state.changedAt,
    motionAnchorLengths,
    totalPathLength,
    activeMotionAnchor,
    nextMotionAnchor,
  ]);

  const isVisualStopActive = (visualId: VisualStopId, logicalStop: StopId) => {
    if (logicalStop !== activeStop) return false;
    if (logicalStop !== 'carnon') return true;
    return state.direction === 'outbound'
      ? visualId === 'carnonOutbound'
      : visualId === 'carnonReturn';
  };

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2.6rem] [--hero-route-base:rgb(125_139_158)] [--hero-route-trail:rgba(56,189,248,0.5)] [--hero-trail-opacity-head:0.8] [--hero-trail-opacity-tail:0.1] [--hero-trail-stroke-width:2.3] [--hero-marker-fill:rgb(255_255_255)] [--hero-marker-stroke:rgb(59_130_246)] [--hero-marker-glow-opacity-active:0.34] [--hero-marker-glow-opacity-inactive:0.24] [--hero-label-fill:rgb(71_85_105)] [--hero-label-stroke:rgba(15,23,42,0.56)] [--hero-label-stroke-width:0.2] [--hero-vehicle-shadow:rgba(2,6,23,0.22)] [--hero-vehicle-body:#ffffff] [--hero-vehicle-cabin:#e2e8f0] [--hero-vehicle-glass:#94a3b8] [--hero-vehicle-wheel:#0f172a] [--hero-vehicle-wheel-center:#cbd5f5] dark:[--hero-route-base:rgb(174_187_204)] dark:[--hero-route-trail:rgba(125,211,252,0.62)] dark:[--hero-trail-opacity-head:0.88] dark:[--hero-trail-opacity-tail:0.12] dark:[--hero-trail-stroke-width:2.3] dark:[--hero-marker-fill:rgb(15_23_42)] dark:[--hero-marker-stroke:rgb(59_130_246)] dark:[--hero-marker-glow-opacity-active:0.34] dark:[--hero-marker-glow-opacity-inactive:0.24] dark:[--hero-label-fill:rgb(148_163_184)] dark:[--hero-label-stroke:rgba(15,23,42,0.6)] dark:[--hero-label-stroke-width:0.18] dark:[--hero-vehicle-shadow:rgba(2,6,23,0.34)] dark:[--hero-vehicle-body:#f8fafc] dark:[--hero-vehicle-cabin:#cbd5e1] dark:[--hero-vehicle-glass:#94a3b8] dark:[--hero-vehicle-wheel:#0f172a] dark:[--hero-vehicle-wheel-center:#e2e8f0]">
      <div className="absolute inset-x-0 top-[13%] bottom-[13%] overflow-hidden rounded-full" aria-hidden>
        <svg viewBox="0 0 180 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <defs>
            <filter id="hero-map-capsule-mask-blur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4.2" />
            </filter>
            <mask id="hero-map-capsule-mask">
              <rect x="0" y="0" width="180" height="100" fill="black" />
              <rect
                x="8"
                y="8"
                width="164"
                height="84"
                rx="42"
                fill="white"
                filter="url(#hero-map-capsule-mask-blur)"
              />
            </mask>
          </defs>
          <g mask="url(#hero-map-capsule-mask)">
            <image
              href={MAP_LIGHT_SRC}
              x="0"
              y="0"
              width="180"
              height="100"
              preserveAspectRatio="none"
              className="dark:hidden"
            />
            <image
              href={MAP_DARK_SRC}
              x="0"
              y="0"
              width="180"
              height="100"
              preserveAspectRatio="none"
              className="hidden dark:block"
            />
          </g>
        </svg>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        role="img"
        aria-label={routeAriaLabel}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden>
          <path
            ref={routePathRef}
            d={ROUTE_PATH_D}
            stroke={TOKEN_ROUTE_BASE}
            strokeWidth="2.5"
          />
          {Array.from({ length: TRAIL_SEGMENT_COUNT }, (_, index) => (
            <line
              key={`trail-segment-static-${index}`}
              ref={(el) => {
                trailSegmentRefs.current[index] = el;
              }}
              x1="0"
              y1="0"
              x2="0"
              y2="0"
              stroke={TOKEN_ROUTE_TRAIL}
              strokeWidth="var(--hero-trail-stroke-width)"
              strokeLinecap="round"
              opacity="0"
              pointerEvents="none"
            />
          ))}
          <circle cx="12" cy="50" r="2.35" fill={TOKEN_MARKER_FILL} stroke={TOKEN_MARKER_STROKE} strokeWidth="1.35" />
          <circle cx="88" cy="50" r="2.35" fill={TOKEN_MARKER_FILL} stroke={TOKEN_MARKER_STROKE} strokeWidth="1.35" />
          {VISUAL_STOPS.map((stop) => {
            const isAnchor = stop.logicalStop === 'montpellier' || stop.logicalStop === 'grandeMotte';
            if (isAnchor) return null;
            const isActive = isVisualStopActive(stop.visualId, stop.logicalStop);
            return (
              <g key={`marker-${stop.visualId}`}>
                <circle
                  cx={stop.x}
                  cy={stop.y}
                  r={isActive ? 1.45 : 1.2}
                  fill={TOKEN_MARKER_STROKE}
                  opacity={isActive ? 'var(--hero-marker-glow-opacity-active)' : 'var(--hero-marker-glow-opacity-inactive)'}
                />
                <circle
                  cx={stop.x}
                  cy={stop.y}
                  r={isActive ? 1.05 : 0.88}
                  fill={TOKEN_MARKER_FILL}
                  stroke={TOKEN_MARKER_STROKE}
                  strokeWidth={isActive ? 0.5 : 0.42}
                />
              </g>
            );
          })}
          {VISUAL_STOPS.map((stop) => {
            const label = locations[stop.logicalStop];
            const isLeftEndpoint = stop.visualId === 'montpellier';
            const isRightEndpoint = stop.visualId === 'grandeMotte';
            const isBottomLabel = stop.labelOffsetY > 0;
            const x = isLeftEndpoint
              ? stop.x - LEFT_ENDPOINT_LABEL_OFFSET
              : isRightEndpoint
                ? stop.x + RIGHT_ENDPOINT_LABEL_OFFSET
                : stop.x;
            const y = isLeftEndpoint || isRightEndpoint
              ? stop.y
              : isBottomLabel
                ? stop.y + BOTTOM_LABEL_OFFSET
                : stop.y - TOP_LABEL_OFFSET;
            const textAnchor = isLeftEndpoint ? 'end' : isRightEndpoint ? 'start' : 'middle';
            return (
              <text
                key={`label-svg-${stop.visualId}`}
                x={x}
                y={y}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                fontSize="2.25"
                fontWeight="500"
                fill={TOKEN_LABEL_FILL}
                stroke={TOKEN_LABEL_STROKE}
                strokeWidth="var(--hero-label-stroke-width)"
                paintOrder="stroke"
                ref={(labelEl) => {
                  labelTextRefs.current[stop.visualId] = labelEl;
                }}
                style={{
                  transformOrigin: `${LABEL_ANCHOR_POINTS[stop.visualId].x}px ${LABEL_ANCHOR_POINTS[stop.visualId].y}px`,
                  transform: 'translate(0px, 0px) scale(1)',
                  transition: 'transform 160ms ease-out',
                }}
              >
                {label}
              </text>
            );
          })}
          <g ref={vehicleRef} transform="translate(0 0)" aria-label={vehicleAriaLabel}>
            <g ref={vehicleFlipRef} transform="scale(1 1)">
              <g transform="scale(1.25)">
                <ellipse cx="0" cy="1.34" rx="1.9" ry="0.42" fill={TOKEN_VEHICLE_SHADOW} />
                <g>
                  <rect x="-2.2" y="-0.9" width="4.4" height="1.4" rx="0.45" fill={TOKEN_VEHICLE_BODY} />
                  <path d="M -1.6 -0.9 L 0.5 -0.9 L 1.3 -0.2 L -1.9 -0.2 Z" fill={TOKEN_VEHICLE_CABIN} />
                  <rect x="-1.2" y="-0.7" width="1.0" height="0.4" rx="0.12" fill={TOKEN_VEHICLE_GLASS} />
                  <rect x="0.0" y="-0.7" width="0.9" height="0.4" rx="0.12" fill={TOKEN_VEHICLE_GLASS} />
                  <circle cx="-1.4" cy="0.75" r="0.4" fill={TOKEN_VEHICLE_WHEEL} />
                  <circle cx="1.4" cy="0.75" r="0.4" fill={TOKEN_VEHICLE_WHEEL} />
                  <circle cx="-1.4" cy="0.75" r="0.16" fill={TOKEN_VEHICLE_WHEEL_CENTER} />
                  <circle cx="1.4" cy="0.75" r="0.16" fill={TOKEN_VEHICLE_WHEEL_CENTER} />
                </g>
              </g>
            </g>
          </g>
        </svg>

        <div className="sr-only">{activeLabel}</div>
      </div>
    </div>
  );
}
