import axios from 'axios';

/**
 * API Service Layer — Real Backend Connection
 * -------------------------------------------
 * Connects to your Express backend at localhost:5000
 * which controls the ESP32 via HTTP/Blynk.
 *
 * Endpoints used:
 *   POST /api/led   → { status: 'on' | 'off' }
 *   GET  /api/led   → { status: 'on' | 'off' }  (optional, for reading state)
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Light config — matches your ESP32 setup.
 * Update room/gpio details to match your hardware.
 */
const LIGHT_CONFIG = {
  id: 'light1',
  name: 'Main Light',
  room: 'Living Room',
  gpio: 2,
};

/**
 * Get the current state of the LED from backend.
 * Falls back to 'off' if GET /api/led is not yet implemented.
 *
 * @returns {{ id, name, room, gpio, isOn: boolean }}
 */
export async function getLightState() {
  try {
    const res = await api.get('/led');
    const isOn = res.data.status === 'ON';
    return { ...LIGHT_CONFIG, isOn };
  } catch (err) {
    // If GET endpoint isn't built yet, default to off
    console.warn('[API] GET /led not available, defaulting to off:', err.message);
    return { ...LIGHT_CONFIG, isOn: false };
  }
}

/**
 * Send LED toggle command to Express backend.
 * Mirrors your controlLED pattern:
 *   POST /api/led  { status: 'on' | 'off' }
 *
 * @param {boolean} isOn
 * @returns {{ success: boolean, state: object }}
 */
export async function toggleLight(isOn) {
  const state = isOn ? 'ON' : 'OFF';

  const res = await api.post('/led', { status: state });

  return {
    success: true,
    state: { ...LIGHT_CONFIG, isOn },
    response: res.data,
  };
}
