import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Clock, X } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay to close sidebar when clicking outside */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sidebar container */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar__header">
          <h2 className="sidebar__title">Menu</h2>
          <button className="sidebar__close" onClick={onClose} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>
        
        <nav className="sidebar__nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Home size={20} />
            <span>Device Control</span>
          </NavLink>
          
          <NavLink 
            to="/azan" 
            className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Clock size={20} />
            <span>Azan Timing</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
