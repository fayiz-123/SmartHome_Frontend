import React from 'react';
import { useDeviceControl } from './hooks/useDeviceControl';
import './index.css';

/* ──────────────────────────────────────────────────────── */
/* SVG Icons                                                */
/* ──────────────────────────────────────────────────────── */

function BulbIcon({ isOn }) {
  return (
    <svg
      className="bulb-svg"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Bulb body */}
      <path
        d="M40 8C26.745 8 16 18.745 16 32c0 8.837 4.768 16.558 11.875 20.837V58a4 4 0 004 4h16.25a4 4 0 004-4v-5.163C59.232 48.558 64 40.837 64 32 64 18.745 53.255 8 40 8z"
        fill={isOn ? '#ffc850' : '#2a2a4a'}
        stroke={isOn ? 'rgba(255,200,80,0.4)' : 'rgba(255,255,255,0.1)'}
        strokeWidth="1.5"
        style={{ transition: 'all 0.4s ease' }}
      />
      {/* Filament lines when ON */}
      {isOn && (
        <>
          <line x1="36" y1="35" x2="44" y2="35" stroke="#fff5d6" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <line x1="33" y1="40" x2="47" y2="40" stroke="#fff5d6" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          <line x1="36" y1="45" x2="44" y2="45" stroke="#fff5d6" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        </>
      )}
      {/* Base stripes */}
      <rect x="28" y="62" width="24" height="4" rx="1" fill={isOn ? 'rgba(255,200,80,0.5)' : 'rgba(255,255,255,0.08)'} style={{ transition: 'all 0.4s ease' }} />
      <rect x="30" y="67" width="20" height="4" rx="1" fill={isOn ? 'rgba(255,200,80,0.35)' : 'rgba(255,255,255,0.06)'} style={{ transition: 'all 0.4s ease' }} />
      {/* Screw base */}
      <rect x="32" y="72" width="16" height="4" rx="2" fill={isOn ? 'rgba(255,200,80,0.2)' : 'rgba(255,255,255,0.05)'} style={{ transition: 'all 0.4s ease' }} />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12L12 3l9 9" stroke="#ff8c42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="#ff8c42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkIcon({ connected = false }) {
  const color = connected ? '#43e97b' : '#4a9eff';
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────── */
/* Helpers                                                  */
/* ──────────────────────────────────────────────────────── */

function formatTime(date) {
  if (!date) return '—';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatRelative(date) {
  if (!date) return '';
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 5) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  return formatTime(date);
}

/* ──────────────────────────────────────────────────────── */
/* Ray lines for the "ON" animation                         */
/* ──────────────────────────────────────────────────────── */

function LightRays() {
  const rayCount = 8;
  return (
    <svg className="light-hero__rays" viewBox="0 0 200 200" aria-hidden="true">
      {Array.from({ length: rayCount }).map((_, i) => {
        const angle = (i / rayCount) * 360;
        const radian = (angle * Math.PI) / 180;
        const x1 = 100 + 50 * Math.cos(radian);
        const y1 = 100 + 50 * Math.sin(radian);
        const x2 = 100 + 90 * Math.cos(radian);
        const y2 = 100 + 90 * Math.sin(radian);
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(255, 200, 80, 0.3)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

/* ──────────────────────────────────────────────────────── */
/* Activity Log Item                                        */
/* ──────────────────────────────────────────────────────── */

function ActivityItem({ entry }) {
  return (
    <div className="activity-item">
      <span className={`activity-dot activity-dot--${entry.action}`} />
      <span className="activity-text">
        Light turned <strong>{entry.action === 'on' ? 'ON' : 'OFF'}</strong>
      </span>
      <span className="activity-time">{formatRelative(entry.time)}</span>
    </div>
  );
}

/* ──────────────────────────────────────────────────────── */
/* Main App                                                 */
/* ──────────────────────────────────────────────────────── */

export default function App() {
  const {
    light,
    isLoading,
    isToggling,
    connectionStatus,
    activityLog,
    lastSync,
    errorMsg,
    toggle,
  } = useDeviceControl();

  const statusConfig = {
    online: { label: 'Online', className: 'status-pill--online' },
    offline: { label: 'Offline', className: 'status-pill--offline' },
    connecting: { label: 'Connecting…', className: 'status-pill--connecting' },
  };

  const status = statusConfig[connectionStatus] ?? statusConfig.connecting;

  return (
    <div className="app">
      {/* ── HEADER ── */}
      <header className="header" role="banner">
        <div className="header__logo">
          <div className="header__logo-icon">
            <HomeIcon />
          </div>
          <div className="header__title-group">
            <h1 className="header__title">SmartHome</h1>
            <p className="header__subtitle">ESP32 Controller</p>
          </div>
        </div>

        <div className="header__actions">
          <span
            className={`status-pill ${status.className}`}
            role="status"
            aria-label={`Device ${status.label}`}
          >
            <span className="status-dot" aria-hidden="true" />
            {status.label}
          </span>
        </div>
      </header>

      {/* ── ERROR TOAST ── */}
      {errorMsg && (
        <div
          role="alert"
          style={{
            background: 'rgba(255,71,87,0.1)',
            border: '1px solid rgba(255,71,87,0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: 'var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            animation: 'slideInUp 0.3s ease-out',
          }}
        >
          <span style={{ fontSize: 14 }}>⚠️</span>
          <span style={{ fontSize: 12, color: 'var(--accent-red)', fontWeight: 500, lineHeight: 1.4 }}>
            {errorMsg}
          </span>
        </div>
      )}

      {/* ── LOADING STATE ── */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)', fontSize: 14 }}>
          Connecting to device…
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      {!isLoading && light && (
        <>
          {/* Hero Light Card */}
          <main>
            <p className="section-label">Device Control</p>

            <article
              className={`light-hero ${light.isOn ? 'light-hero--on' : ''}`}
              aria-label={`${light.name} — currently ${light.isOn ? 'on' : 'off'}`}
            >
              {/* Glow background effect */}
              <div className="light-hero__glow" aria-hidden="true" />
              <LightRays />

              <div className="light-hero__content">
                {/* Bulb */}
                <div className="bulb-icon-wrap">
                  <div className="bulb-halo" aria-hidden="true" />
                  <BulbIcon isOn={light.isOn} />
                </div>

                {/* Info */}
                <div className="light-hero__info">
                  <h2 className="light-hero__name">{light.name}</h2>
                  <p className="light-hero__room">{light.room}</p>
                  <span className="light-hero__state-badge">
                    {light.isOn ? '● On' : '○ Off'}
                  </span>
                </div>

                {/* Toggle */}
                <div className="toggle-wrap">
                  <label
                    className="toggle-switch"
                    htmlFor="light-toggle"
                    aria-label={`Toggle ${light.name}`}
                  >
                    <input
                      id="light-toggle"
                      type="checkbox"
                      checked={light.isOn}
                      onChange={toggle}
                      disabled={isToggling || connectionStatus === 'offline'}
                    />
                    <span className="toggle-slider" />
                  </label>
                  <span className="toggle-label">
                    {isToggling ? 'Updating…' : light.isOn ? 'Tap to turn off' : 'Tap to turn on'}
                  </span>
                </div>
              </div>
            </article>

            {/* Info Grid */}
            <div className="info-grid" role="region" aria-label="Device details">
              <div className="info-card">
                <p className="info-card__label">GPIO Pin</p>
                <p className="info-card__value info-card__value--accent">GPIO {light.gpio}</p>
                <p className="info-card__sub">ESP32</p>
              </div>
              <div className="info-card">
                <p className="info-card__label">Last Sync</p>
                <p className="info-card__value">{formatTime(lastSync)}</p>
                <p className="info-card__sub">{lastSync ? 'Today' : 'Never'}</p>
              </div>
            </div>
          </main>

          {/* ── ACTIVITY LOG ── */}
          <section className="activity-section" aria-label="Activity history">
            <p className="section-label">Recent Activity</p>

            {activityLog.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-lg)', color: 'var(--text-muted)', fontSize: 13 }}>
                No activity yet — toggle the light to begin
              </div>
            ) : (
              <div className="activity-list">
                {activityLog.map((entry) => (
                  <ActivityItem key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </section>

          {/* ── BACKEND CONNECT BANNER ── */}
          <div
            className="connect-banner"
            role="complementary"
            aria-label="Backend connection info"
            style={connectionStatus === 'online' ? {
              background: 'linear-gradient(135deg, rgba(67,233,123,0.08), rgba(67,233,123,0.03))',
              borderColor: 'rgba(67,233,123,0.2)',
            } : {}}
          >
            <div
              className="connect-banner__icon"
              style={connectionStatus === 'online' ? { background: 'rgba(67,233,123,0.15)' } : {}}
            >
              <LinkIcon connected={connectionStatus === 'online'} />
            </div>
            <div className="connect-banner__text">
              <p
                className="connect-banner__title"
                style={connectionStatus === 'online' ? { color: 'var(--accent-green)' } : {}}
              >
                {connectionStatus === 'online' ? '✓ Express Backend Connected' : 'Express Backend'}
              </p>
              <p className="connect-banner__desc">
                {connectionStatus === 'online'
                  ? 'Sending commands to localhost:5000/api/led → ESP32 (192.168.1.100)'
                  : 'Start your Express server at localhost:5000 to control the ESP32'}
              </p>
            </div>
          </div>
        </>
      )}

      {/* ── FOOTER ── */}
      <footer className="footer">
        <p className="footer__text">SmartHome PWA · Built with <span>♥</span> on ESP32</p>
      </footer>
    </div>
  );
}
