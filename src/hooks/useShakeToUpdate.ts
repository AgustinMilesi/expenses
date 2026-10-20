import { useEffect, useRef } from 'react';
import { Vibration, Platform } from 'react-native';
import {
  useAnimatedSensor,
  SensorType,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';

interface ShakeOptions {
  threshold?: number;
  cooldownMs?: number;
  enabled?: boolean;
}

/**
 * Custom hook to detect vigorous shaking of the physical device using Reanimated's
 * hardware-accelerated accelerometer sensor.
 * 
 * Works smoothly on physical devices (Android & iOS) and provides haptic feedback.
 */
export function useShakeToUpdate(
  onShake: () => void,
  options: ShakeOptions = {}
) {
  const {
    threshold = 14,
    cooldownMs = 2500,
    enabled = true,
  } = options;

  const lastShakeTime = useRef(0);

  // Reanimated 4.x accelerometer hook (reads at 50ms intervals)
  // Interval of 50ms is optimal to catch rapid shake reversals without battery drain
  const sensor = useAnimatedSensor(SensorType.ACCELEROMETER, {
    interval: 50,
  });

  const fireShake = () => {
    const now = Date.now();
    if (now - lastShakeTime.current > cooldownMs) {
      lastShakeTime.current = now;
      // Provide immediate physical haptic feedback
      try {
        if (Platform.OS !== 'web') {
          Vibration.vibrate([0, 70, 40, 70]);
        }
      } catch (err) {
        // Safe fallback if vibration permission or device lacks vibration motor
      }
      onShake();
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

      // Delta of acceleration across axes
      const dx = Math.abs(current.x - previous.x);
      const dy = Math.abs(current.y - previous.y);
      const dz = Math.abs(current.z - previous.z);
      const delta = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Total acceleration magnitude
      const total = Math.sqrt(
        current.x * current.x + current.y * current.y + current.z * current.z
      );

      // Trigger condition:
      // Earth gravity is ~9.81 m/s^2.
      // Rapid direction change (delta > threshold) OR high G spike (total > 26 m/s^2 ≈ 2.7G)
      if (delta > threshold || total > 26) {
        runOnJS(fireShake)();
      }
    },
    [enabled, threshold, cooldownMs]
  );
}
