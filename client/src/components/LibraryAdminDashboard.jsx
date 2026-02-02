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
          const formattedLogs = data.map((log) => {
            const timeInDecimal = log["Time In"];

            if (timeInDecimal !== undefined && !isNaN(timeInDecimal)) {
              const hours = Math.floor(timeInDecimal * 24);
              const minutes = Math.round((timeInDecimal * 24 - hours) * 60);

              const formattedTime = new Date();
              formattedTime.setHours(hours);
              formattedTime.setMinutes(minutes);

              const formattedTimeString = formattedTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return {
                ...log,
                checkInTime: formattedTimeString,
                date: new Date().toISOString().split('T')[0],
              };
            }

            return log;
          });

          setLogs(formattedLogs);
        } catch (error) {
          console.error('Error fetching logs:', error);
        }
      };

      fetchLogs();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', JSON.stringify(!darkMode));
  };

  const handleLogout = () => {
    localStorage.removeItem('darkMode');
    window.location.href = '/';
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
    const today = new Date('2025-01-29');

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
    const today = new Date('2025-01-29');
    const selectedDateObj = new Date(dateStr);
    const diffTime = today - selectedDateObj;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return dateStr;
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
              <svg className="logout-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M16 13v-2H7V8l-5 4 5 4v-3h9z"></path><path d="M20 3h-8v2h8v14h-8v2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path></svg>
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
                  onChange={(e) => setSelectedDate(e.target.value)}
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
                    onClick={() => setActiveTab('all')}
                  >
                    All
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`}
                    onClick={() => setActiveTab('today')}
                  >
                    Today
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'week' ? 'active' : ''}`}
                    onClick={() => setActiveTab('week')}
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
                    {logs.length > 0 ? (
                      logs.map((entry) => (
                        <tr key={entry.ID}>
                          <td>{entry.Name}</td>
                          <td>{entry.ID}</td>
                          <td>{entry.Program}</td>
                          <td>{entry.date}</td>
                          <td>{entry.checkInTime}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No logs available.</td>
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
