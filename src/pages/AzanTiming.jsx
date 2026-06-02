import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MapPin, Clock, Calendar, Menu } from 'lucide-react';

export default function AzanTiming() {
  const { openSidebar } = useOutletContext();
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace this when user provides the actual API.
    // Using Aladhan free API as a temporary placeholder
    const fetchTimings = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.aladhan.com/v1/timings?latitude=10.1076&longitude=76.3516&method=1');
        const data = await response.json();
        
        if (data.code === 200) {
          setApiData(data.data);
        } else {
          setError('Failed to fetch timings');
        }
      } catch (err) {
        setError('Error fetching data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimings();
  }, []);

  const prayerIcons = {
    Fajr: '🌄',
    Dhuhr: '☀️',
    Asr: '🌤️',
    Maghrib: '🌇',
    Isha: '🌙'
  };

  const formatAMPM = (timeStr) => {
    if (!timeStr) return '';
    // timeStr could be "18:42" or "18:42 (IST)", extract just the time
    const cleanTime = timeStr.split(' ')[0];
    const [h, m] = cleanTime.split(':');
    let hours = parseInt(h, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
    return `${hours}:${m} ${ampm}`;
  };

  const getFilteredTimings = () => {
    if (!apiData || !apiData.timings) return [];
    // Only showing the 5 main prayers
    const mainPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    return mainPrayers.map(prayer => ({
      name: prayer,
      time: formatAMPM(apiData.timings[prayer])
    }));
  };

  const hijri = apiData?.date?.hijri;
  const gregorian = apiData?.date?.gregorian;
  const timings = apiData?.timings;

  return (
    <div className="azan-page">
      <header className="header" style={{ marginBottom: '10px' }}>
        <div className="header__logo">
          <button className="hamburger-inline" onClick={openSidebar} aria-label="Open menu">
            <Menu size={24} />
          </button>
          <div className="header__title-group">
            <h1 className="header__title">Azan Timings</h1>
            <p className="header__subtitle">Daily Prayer Schedule</p>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="loading-state">Loading prayer timings...</div>
      ) : error ? (
        <div className="error-toast">⚠️ {error}</div>
      ) : (
        <div className="azan-container">
          
          {hijri && gregorian && (
            <div className="date-card">
              <div className="date-card__hijri">
                <span className="hijri-day">{hijri.day}</span>
                <span className="hijri-month">{hijri.month.ar} ({hijri.month.en})</span>
                <span className="hijri-year">{hijri.year} {hijri.designation.abbreviated}</span>
              </div>
              <div className="date-card__gregorian">
                <Calendar size={14} style={{ marginRight: '6px' }} />
                <span>{gregorian.day} {gregorian.month.en} {gregorian.year}, {gregorian.weekday.en}</span>
              </div>
            </div>
          )}

          <div className="azan-location">
            <MapPin size={18} />
            {/* Hardcoded for now based on API coords in previous example, update later as needed */}
            <span>Aluva, Kerala</span>
          </div>

          {timings && (
            <div className="sun-card-row">
              <div className="sun-card">
                <div className="sun-card__icon sun-rise">🌅</div>
                <div className="sun-card__info">
                  <span className="sun-card__label">Sunrise</span>
                  <span className="sun-card__time">{formatAMPM(timings.Sunrise)}</span>
                </div>
              </div>
              <div className="sun-card">
                <div className="sun-card__icon sun-set">🌆</div>
                <div className="sun-card__info">
                  <span className="sun-card__label">Sunset</span>
                  <span className="sun-card__time">{formatAMPM(timings.Sunset)}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="azan-list">
            {getFilteredTimings().map((prayer, index) => (
              <div key={index} className="azan-card">
                <div className="azan-card__icon">{prayerIcons[prayer.name]}</div>
                <div className="azan-card__info">
                  <h3 className="azan-card__name">{prayer.name}</h3>
                  <div className="azan-card__time">
                    <Clock size={14} />
                    <span>{prayer.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
