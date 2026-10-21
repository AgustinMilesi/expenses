import { useEffect, useRef } from 'react';
import { Vibration, Platform } from 'react-native';
import {
  useAnimatedSensor,
  SensorType,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { ShakeSensitivity } from '../types/expense';

interface ShakeOptions {
  sensitivity?: ShakeSensitivity;
  cooldownMs?: number;
  enabled?: boolean;
}

interface SensitivityConfig {
  deltaThreshold: number;
  totalThreshold: number;
  requiredHits: number;
  windowMs: number;
}

const SENSITIVITY_CONFIGS: Record<ShakeSensitivity, SensitivityConfig> = {
  // FIRM (Default & Recommended): Requires deliberate, vigorous back-and-forth shaking (3 hits)
  // Completely ignores walking, phone pickup, fast swipes, and casual movements.
  firm: {
    deltaThreshold: 26,
    totalThreshold: 34,
    requiredHits: 3,
    windowMs: 900,
  },
  // MEDIUM: Requires 2 firm, deliberate strokes.
  medium: {
    deltaThreshold: 20,
    totalThreshold: 28,
    requiredHits: 2,
    windowMs: 800,
  },
  // GENTLE: More reactive, for users who want easier triggers.
  gentle: {
    deltaThreshold: 16,
    totalThreshold: 23,
    requiredHits: 2,
    windowMs: 700,
  },
};

/**
 * Custom hook to detect physical device shaking using Reanimated's accelerometer.
 * 
 * Uses a multi-hit oscillation algorithm:
 * It requires multiple rapid directional reversals (hits) within a rolling time window
 * to distinguish genuine intentional shakes from accidental movements, walking, or dropping.
 */
export function useShakeToUpdate(
  onShake: () => void,
  options: ShakeOptions = {}
) {
  const {
    sensitivity = 'firm',
    cooldownMs = 3000,
    enabled = true,
  } = options;

  const config = SENSITIVITY_CONFIGS[sensitivity] || SENSITIVITY_CONFIGS.firm;

  const lastShakeTime = useRef(0);
  const hitCount = useRef(0);
  const firstHitTime = useRef(0);
  const lastHitTime = useRef(0);

  // Reanimated accelerometer with 50ms sampling rate
  const sensor = useAnimatedSensor(SensorType.ACCELEROMETER, {
    interval: 50,
  });

  const registerCandidateHit = () => {
    const now = Date.now();

    // Respect post-shake cooldown
    if (now - lastShakeTime.current < cooldownMs) {
      return;
    }

    // If the multi-hit window expired, start a new burst from hit 1
    if (now - firstHitTime.current > config.windowMs) {
      hitCount.current = 1;
      firstHitTime.current = now;
      lastHitTime.current = now;
      return;
    }

    // Require at least 110ms between hits to ensure they are distinct physical reversals
    // (prevents counting adjacent 50ms frames from a single jerk)
    if (now - lastHitTime.current >= 110) {
      hitCount.current += 1;
      lastHitTime.current = now;

      // When the user completes the required number of distinct vigorous oscillations
      if (hitCount.current >= config.requiredHits) {
        hitCount.current = 0;
        firstHitTime.current = 0;
        lastShakeTime.current = now;

        // Distinct dual-pulse tactile haptic feedback
        try {
          if (Platform.OS !== 'web') {
            Vibration.vibrate([0, 80, 50, 90]);
          }
        } catch (err) {
          // Safe fallback if vibration is unsupported or disabled
        }

        onShake();
      }
    }
  };

  useAnimatedReaction(
    () => {
      if (!enabled) return null;
      return sensor.sensor.value;
    },
    (current, previous) => {
      'worklet';
      if (!enabled || !current || !previous) return;

      // Delta of acceleration across all 3 axes
      const dx = Math.abs(current.x - previous.x);
      const dy = Math.abs(current.y - previous.y);
      const dz = Math.abs(current.z - previous.z);
      const delta = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Total acceleration magnitude
      const total = Math.sqrt(
        current.x * current.x + current.y * current.y + current.z * current.z
      );

      // Candidate spike criteria:
      // High delta (rapid change of direction) OR high G magnitude spike
      if (delta > config.deltaThreshold || total > config.totalThreshold) {
        runOnJS(registerCandidateHit)();
      }
    },
    [enabled, sensitivity, config.deltaThreshold, config.totalThreshold, config.requiredHits, config.windowMs, cooldownMs]
  );
}
