import { useState, useEffect, useCallback } from 'react';
import { getLightState, toggleLight } from '../services/api';

/**
 * useDeviceControl
 * ----------------
 * Manages the smart light state.
 * Talks to Express backend → ESP32 via api.js
 */
export function useDeviceControl() {
  const [light, setLight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [activityLog, setActivityLog] = useState([]);
  const [lastSync, setLastSync] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Load initial state from backend
  useEffect(() => {
    const load = async () => {
      try {
        setConnectionStatus('connecting');
        setErrorMsg(null);
        const state = await getLightState();
        setLight(state);
        setConnectionStatus('online');
        setLastSync(new Date());
      } catch (err) {
        console.error('[Device] Failed to load state:', err);
        setConnectionStatus('offline');
        setErrorMsg('Cannot reach backend — is your Express server running on localhost:5000?');
        // Still show a default light card so UI doesn't break
        setLight({ id: 'light1', name: 'Main Light', room: 'Living Room', gpio: 2, isOn: false });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Browser online/offline events
  useEffect(() => {
    const handleOnline = () => setConnectionStatus('online');
    const handleOffline = () => {
      setConnectionStatus('offline');
      setErrorMsg('No internet connection');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * Toggle: optimistic update → POST /api/led → confirm or revert.
   */
  const toggle = useCallback(async () => {
    if (!light || isToggling) return;

    const previousState = light.isOn;
    const newState = !previousState;

    // Optimistic update for snappy UI
    setLight((prev) => ({ ...prev, isOn: newState }));
    setIsToggling(true);
    setErrorMsg(null);

    // Add to activity log immediately
    const logEntry = { id: Date.now(), action: newState ? 'on' : 'off', time: new Date() };
    setActivityLog((prev) => [logEntry, ...prev].slice(0, 10));

    try {
      const result = await toggleLight(newState);
      if (result.success) {
        setLight(result.state);
        setLastSync(new Date());
        setConnectionStatus('online');
      } else {
        throw new Error('Backend returned failure');
      }
    } catch (err) {
      console.error('[Device] Toggle failed:', err);

      // Revert optimistic update
      setLight((prev) => ({ ...prev, isOn: previousState }));
      setActivityLog((prev) => prev.filter((e) => e.id !== logEntry.id));
      setConnectionStatus('offline');

      // User-friendly error message
      if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED') {
        setErrorMsg('Cannot reach backend — check your Express server at localhost:5000');
      } else if (err.response) {
        setErrorMsg(`Server error ${err.response.status}: ${err.response.data?.message ?? 'Unknown error'}`);
      } else {
        setErrorMsg('Failed to control LED — please try again');
      }
    } finally {
      setIsToggling(false);
    }
  }, [light, isToggling]);

  return {
    light,
    isLoading,
    isToggling,
    connectionStatus,
    activityLog,
    lastSync,
    errorMsg,
    toggle,
  };
}
