import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import mapuaLogo from './assets/Mapua Logo.png';
import nameLogo from './assets/Name Logo.png';
import analyticsIcon from './assets/chat-arrow-grow.png';
import userIcon from './assets/access-control.png';
import logoutIcon from './assets/exit.png';
import './Sidebar.css';

export default function Sidebar({ darkMode }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('darkMode');
      window.location.href = '/login';
    }
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${darkMode ? 'dark-mode' : ''}`}>
      {/* Top Section with Logos Stacked */}
      <div className="sidebar-top">
        <div className="logos-stack">
          <img src={mapuaLogo} alt="Mapua Logo" className="mapua-logo" />
          <img src={nameLogo} alt="Mapua Name" className="name-logo" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/dashboard/analytics"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <img src={analyticsIcon} alt="Analytics" className="nav-icon" />
              {isExpanded && <span className="nav-text">Analytics</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/user-creation"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <img src={userIcon} alt="Create User" className="nav-icon" />
              {isExpanded && <span className="nav-text">Create User</span>}
            </NavLink>
          </li>
          <li>
            <button
              className="logout-button"
              onClick={handleLogout}
              title="Logout"
            >
              <img src={logoutIcon} alt="Logout" className="logout-icon" />
              {isExpanded && <span className="logout-text">Logout</span>}
            </button>
          </li>
        </ul>
      </nav>

      {/* Bottom Section with Toggle Button */}
      <div className="sidebar-bottom">
        <button
          className="toggle-sidebar-btn"
          onClick={toggleSidebar}
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          <span className="toggle-icon">{isExpanded ? '◀' : '▶'}</span>
        </button>
      </div>
    </div>
  );
}
