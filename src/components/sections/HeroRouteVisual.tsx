'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

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
const TRAIL_HIDDEN_EPSILON = 0.05;
const TRAIL_CATCHUP_MULTIPLIER = 2;
const TRAIL_MOVEMENT_EPSILON = 0.0005;
const TOKEN_ROUTE_BASE = 'var(--hero-route-base)';
const TOKEN_ROUTE_TRAIL = 'var(--hero-route-trail)';
const TOKEN_MARKER_FILL = 'var(--hero-marker-fill)';
const TOKEN_MARKER_STROKE = 'var(--hero-marker-stroke)';
const TOKEN_LABEL_FILL = 'var(--hero-label-fill)';
const TOKEN_LABEL_STROKE = 'var(--hero-label-stroke)';
const TOKEN_VEHICLE_SHADOW = 'var(--hero-vehicle-shadow)';

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

const BACKGROUNDS: Record<StopId, string> = {
  montpellier: `${BASE_PATH}/hero/locations/montpellier.jpg`,
  portMarianne: `${BASE_PATH}/hero/locations/port-marianne.jpg`,
  carnon: `${BASE_PATH}/hero/locations/carnon.jpg`,
  grandeMotte: `${BASE_PATH}/hero/locations/grande-motte.jpg`,
  palavas: `${BASE_PATH}/hero/locations/palavas.jpg`,
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
  const [trailState, setTrailState] = useState<{ head: number; tail: number; visibleLength: number }>({
    head: 0,
    tail: 0,
    visibleLength: 0,
  });
  const routePathRef = useRef<SVGPathElement | null>(null);
  const trailHeadRef = useRef(0);
  const trailTailRef = useRef(0);
  const previousDirectionRef = useRef<Direction>('outbound');
  const previousTickMsRef = useRef<number | null>(null);
  const previousCurrentLengthRef = useRef<number | null>(null);
  const trailDirectionSignRef = useRef<1 | -1>(1);

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
    const tick = () => {
      setNowMs(Date.now());
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
  const activeBackground = BACKGROUNDS[activeStop];
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
  const currentLength = vehiclePosition.currentLength;
  const isMoving = activeMotionAnchor !== nextMotionAnchor;

  useEffect(() => {
    if (currentLength === null || totalPathLength <= 0) return;

    const normalize = (length: number) =>
      ((length % totalPathLength) + totalPathLength) % totalPathLength;
    const signedDelta = (from: number, to: number) => {
      let delta = to - from;
      if (delta > totalPathLength / 2) delta -= totalPathLength;
      if (delta < -totalPathLength / 2) delta += totalPathLength;
      return delta;
    };

    const normalizedCurrent = normalize(currentLength);
    const now = Date.now();
    const previousTick = previousTickMsRef.current ?? now;
    const elapsedMs = Math.max(now - previousTick, 0);
    previousTickMsRef.current = now;

    const directionChanged = previousDirectionRef.current !== state.direction;
    previousDirectionRef.current = state.direction;

    if (directionChanged) {
      trailHeadRef.current = normalizedCurrent;
      trailTailRef.current = normalizedCurrent;
      previousCurrentLengthRef.current = normalizedCurrent;
      setTrailState({ head: normalizedCurrent, tail: normalizedCurrent, visibleLength: 0 });
      return;
    }

    const previousCurrent = previousCurrentLengthRef.current ?? normalizedCurrent;
    const movementDelta = signedDelta(previousCurrent, normalizedCurrent);
    previousCurrentLengthRef.current = normalizedCurrent;

    const isActuallyMoving = isMoving && Math.abs(movementDelta) > TRAIL_MOVEMENT_EPSILON;
    if (isActuallyMoving) {
      const actualDirectionSign: 1 | -1 = movementDelta > 0 ? 1 : -1;
      if (trailDirectionSignRef.current !== actualDirectionSign) {
        trailHeadRef.current = normalizedCurrent;
        trailTailRef.current = normalizedCurrent;
        trailDirectionSignRef.current = actualDirectionSign;
        setTrailState({ head: normalizedCurrent, tail: normalizedCurrent, visibleLength: 0 });
        return;
      }
      trailDirectionSignRef.current = actualDirectionSign;
    }
    const movementSign = trailDirectionSignRef.current;

    trailHeadRef.current = normalizedCurrent;

    let nextVisibleLength = trailState.visibleLength;
    if (!isActuallyMoving) {
      const catchupSpeed = (ROUTE_TRAIL_LENGTH / STEP_MS) * elapsedMs * TRAIL_CATCHUP_MULTIPLIER;
      nextVisibleLength = Math.max(0, nextVisibleLength - catchupSpeed);
    } else {
      nextVisibleLength = Math.min(ROUTE_TRAIL_LENGTH, nextVisibleLength + Math.abs(movementDelta));
    }

    trailTailRef.current = normalize(trailHeadRef.current - movementSign * nextVisibleLength);
    const visibleLength = nextVisibleLength;
    setTrailState({
      head: trailHeadRef.current,
      tail: trailTailRef.current,
      visibleLength,
    });
  }, [currentLength, totalPathLength, state.direction, isMoving, trailState.visibleLength]);

  const isTrailVisible = !reducedMotion && trailState.visibleLength > TRAIL_HIDDEN_EPSILON;
  const trailSegments = useMemo(() => {
    const path = routePathRef.current;
    if (!path || totalPathLength <= 0 || trailState.visibleLength <= 0) return [];

    const segmentCount = Math.max(
      2,
      Math.min(
        TRAIL_SAMPLE_COUNT,
        Math.ceil((trailState.visibleLength / ROUTE_TRAIL_LENGTH) * TRAIL_SAMPLE_COUNT),
      ),
    );

    const points: { x: number; y: number }[] = [];
    for (let i = 0; i <= segmentCount; i += 1) {
      const distanceBehindHead = (trailState.visibleLength * i) / segmentCount;
      const sampleLength = trailState.head - distanceBehindHead;
      const normalizedSampleLength =
        ((sampleLength % totalPathLength) + totalPathLength) % totalPathLength;
      const point = path.getPointAtLength(normalizedSampleLength);
      points.push({ x: point.x, y: point.y });
    }

    const segments: { x1: number; y1: number; x2: number; y2: number; opacity: number }[] = [];
    for (let i = 0; i < points.length - 1; i += 1) {
      const alpha = 0.85 * (1 - i / segmentCount);
      const opacity = Math.max(0.1, alpha);
      segments.push({
        x1: points[i].x,
        y1: points[i].y,
        x2: points[i + 1].x,
        y2: points[i + 1].y,
        opacity,
      });
    }
    return segments;
  }, [trailState.head, trailState.visibleLength, totalPathLength]);

  const isVisualStopActive = (visualId: VisualStopId, logicalStop: StopId) => {
    if (logicalStop !== activeStop) return false;
    if (logicalStop !== 'carnon') return true;
    return state.direction === 'outbound'
      ? visualId === 'carnonOutbound'
      : visualId === 'carnonReturn';
  };

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2.4rem] border border-slate-200/55 bg-slate-100/30 [--hero-route-base:rgb(203_213_225)] [--hero-route-trail:rgba(56,189,248,0.5)] [--hero-marker-fill:rgb(248_250_252)] [--hero-marker-stroke:rgba(56,189,248,0.86)] [--hero-label-fill:rgb(226_232_240)] [--hero-label-stroke:rgba(15,23,42,0.45)] [--hero-vehicle-shadow:rgba(2,6,23,0.22)] dark:border-slate-700/55 dark:bg-slate-800/24 dark:[--hero-route-base:rgb(148_163_184)] dark:[--hero-route-trail:rgba(125,211,252,0.62)] dark:[--hero-marker-fill:rgb(226_232_240)] dark:[--hero-marker-stroke:rgba(125,211,252,0.92)] dark:[--hero-label-fill:rgb(241_245_249)] dark:[--hero-label-stroke:rgba(15,23,42,0.6)] dark:[--hero-vehicle-shadow:rgba(2,6,23,0.34)]">
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_120%_100%_at_50%_50%,black_52%,rgba(0,0,0,0.92)_66%,rgba(0,0,0,0.58)_80%,transparent_100%)] [mask-repeat:no-repeat] [mask-size:100%_100%]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeBackground}
            className="absolute inset-0"
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reducedMotion ? 1 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.45, ease: 'easeOut' }}
          >
            <Image
              src={activeBackground}
              alt={imageAlt}
              fill
              className="object-cover opacity-55 dark:opacity-50"
              priority={activeStop === 'montpellier'}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-900/20 to-slate-900/28 dark:from-slate-950/16 dark:via-slate-950/27 dark:to-slate-950/36"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_58%,rgba(2,6,23,0.08)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_56%,rgba(2,6,23,0.14)_100%)]"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0"
        role="img"
        aria-label={routeAriaLabel}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full" fill="none" aria-hidden>
          <defs>
            <linearGradient id="hero-route-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={TOKEN_ROUTE_BASE} />
              <stop offset="50%" stopColor="rgb(241 245 249)" />
              <stop offset="100%" stopColor={TOKEN_ROUTE_BASE} />
            </linearGradient>
          </defs>
          <path
            ref={routePathRef}
            d={ROUTE_PATH_D}
            stroke="url(#hero-route-line)"
            strokeWidth="2.5"
            className="drop-shadow-[0_0_4px_rgba(248,250,252,0.26)]"
          />
          {isTrailVisible
            ? trailSegments.map((segment, index) => (
                <line
                  key={`trail-segment-${index}`}
                  x1={segment.x1}
                  y1={segment.y1}
                  x2={segment.x2}
                  y2={segment.y2}
                  stroke={TOKEN_ROUTE_TRAIL}
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  opacity={segment.opacity}
                  pointerEvents="none"
                />
              ))
            : null}
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
                  opacity={isActive ? 0.18 : 0.12}
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
            const isActive = isVisualStopActive(stop.visualId, stop.logicalStop);
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
                fill={isActive ? TOKEN_MARKER_FILL : TOKEN_LABEL_FILL}
                stroke={TOKEN_LABEL_STROKE}
                strokeWidth="0.18"
                paintOrder="stroke"
              >
                {label}
              </text>
            );
          })}
          <g transform={`translate(${vehiclePosition.x} ${vehiclePosition.y})`} aria-label={vehicleAriaLabel}>
            <g transform={`scale(${state.direction === 'outbound' ? -1 : 1}, 1)`}>
              <g transform="scale(1.25)">
                <ellipse cx="0" cy="1.34" rx="1.9" ry="0.42" fill={TOKEN_VEHICLE_SHADOW} />
                <g>
                  <rect x="-2.2" y="-0.9" width="4.4" height="1.4" rx="0.45" fill="#ffffff" />
                  <path d="M -1.6 -0.9 L 0.5 -0.9 L 1.3 -0.2 L -1.9 -0.2 Z" fill="#e2e8f0" />
                  <rect x="-1.2" y="-0.7" width="1.0" height="0.4" rx="0.12" fill="#94a3b8" />
                  <rect x="0.0" y="-0.7" width="0.9" height="0.4" rx="0.12" fill="#94a3b8" />
                  <circle cx="-1.4" cy="0.75" r="0.4" fill="#0f172a" />
                  <circle cx="1.4" cy="0.75" r="0.4" fill="#0f172a" />
                  <circle cx="-1.4" cy="0.75" r="0.16" fill="#cbd5f5" />
                  <circle cx="1.4" cy="0.75" r="0.16" fill="#cbd5f5" />
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
