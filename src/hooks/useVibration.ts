import { useCallback } from 'react';

export function useVibration() {
  const vibrate = useCallback((pattern: number | number[]) => {
    if (!navigator.vibrate) {
      return;
    }

    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.log('Vibration not supported or failed:', error);
    }
  }, []);

  const vibrateSuccess = useCallback(() => {
    vibrate([100, 50, 100]);
  }, [vibrate]);

  const vibrateError = useCallback(() => {
    vibrate([200, 100, 200, 100, 200]);
  }, [vibrate]);

  const vibrateClick = useCallback(() => {
    vibrate(50);
  }, [vibrate]);

  const vibratePulse = useCallback(() => {
    vibrate([100]);
  }, [vibrate]);

  return {
    vibrate,
    vibrateSuccess,
    vibrateError,
    vibrateClick,
    vibratePulse
  };
}