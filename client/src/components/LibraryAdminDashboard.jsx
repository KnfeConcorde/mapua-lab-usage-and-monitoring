import React, { useState, useEffect } from 'react';
import PieChartAnalytics from './PieChartAnalytics';
import StudentDailyEntries from './StudentDailyEntries';
import darkLightIcon from './assets/darklight.png';
import './LibraryAdminDashboard.css';

const exportToExcel = (data, fileName = 'login-history.xlsx') => {};

export default function LibraryAdminDashboard() {
  const [logs, setLogs] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/logs');
        const data = await response.json();
        
        setLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, []);

  // Filter logs whenever filters change
  useEffect(() => {
    let filtered = [...logs];

    // Filter by program
    if (selectedProgram !== 'all') {
      filtered = filtered.filter(log => log.Program === selectedProgram);
    }

    // Filter by selected date
    if (selectedDate) {
      filtered = filtered.filter(log => log.date === selectedDate);
    }

    // Filter by tab (all/today/week)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (activeTab === 'today') {
      const todayStr = today.toISOString().split('T')[0];
      filtered = filtered.filter(log => log.date === todayStr);
    } else if (activeTab === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekAgoStr = weekAgo.toISOString().split('T')[0];
      
      filtered = filtered.filter(log => {
        return log.date >= weekAgoStr;
      });
    }

    setFilteredData(filtered);
  }, [logs, selectedProgram, selectedDate, activeTab]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', JSON.stringify(!darkMode));
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('darkMode');
    window.location.href = '/login';
  };

  const programs = [
    'all',
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Data Science',
    'Biotechnology',
    'Chemical Engineering',
    'Architecture'
  ];

  const getDateOptions = () => {
    const options = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      options.push(dateStr);
    }
    return options;
  };

  const dateOptions = getDateOptions();

  const getDateLabel = (dateStr) => {
    if (!dateStr) return 'All Dates';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateObj = new Date(dateStr);
    selectedDateObj.setHours(0, 0, 0, 0);
    const diffTime = today - selectedDateObj;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return dateStr;
  };

  // Reset date filter when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== 'all') {
      setSelectedDate(''); // Clear date dropdown when using tabs
    }
  };

  // Reset tab when date is selected
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      setActiveTab('all'); // Reset tab when selecting specific date
    }
  };

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Library Admin Dashboard</h1>
            <p className="header-subtitle">Monitor library analytics and student activities</p>
          </div>
          <div className="header-controls">
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <svg className="logout-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M16 13v-2H7V8l-5 4 5 4v-3h9z"></path>
                <path d="M20 3h-8v2h8v14h-8v2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path>
              </svg>
              <span className="label">Logout</span>
            </button>

            <button className="dark-mode-toggle" onClick={toggleDarkMode} title="Toggle Dark Mode">
              <img src={darkLightIcon} alt="Dark/Light Mode" className="dark-mode-icon" />
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-left">
          <div className="analytics-card">
            <h2>Library Usage Analytics</h2>
            <PieChartAnalytics darkMode={darkMode} />
          </div>
        </div>

        <div className="dashboard-right">
          <div className="entries-card">
            <div className="entries-header">
              <h2>Log-In History</h2>

              <div className="filter-controls">
                <select
                  className="date-dropdown"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  title="Select a date to view"
                >
                  <option value="">All Dates</option>
                  {dateOptions.map((date) => (
                    <option key={date} value={date}>
                      {getDateLabel(date)}
                    </option>
                  ))}
                </select>
                <select
                  className="program-dropdown"
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                >
                  <option value="all">All Programs</option>
                  {programs.filter(p => p !== 'all').map((program) => (
                    <option key={program} value={program}>
                      {program}
                    </option>
                  ))}
                </select>
                <div className="filter-tabs">
                  <button
                    className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => handleTabChange('all')}
                  >
                    All
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`}
                    onClick={() => handleTabChange('today')}
                  >
                    Today
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'week' ? 'active' : ''}`}
                    onClick={() => handleTabChange('week')}
                  >
                    This Week
                  </button>
                </div>
              </div>
            </div>

            <div className="entries-table-container">
              <div className="entries-scroll">
                <table className="entries-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Student Number</th>
                      <th>Program</th>
                      <th>Date</th>
                      <th>Check-in Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((entry, index) => (
                        <tr key={`${entry.ID}-${index}`}>
                          <td>{entry.Name}</td>
                          <td>{entry.ID}</td>
                          <td>{entry.Program}</td>
                          <td>{entry.date}</td>
                          <td>{entry.checkInTime}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                          No logs available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}