import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LibraryAdminDashboard from './components/LibraryAdminDashboard';
import Login from '../components/Login';

function FileUploadPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: fd
      });
      
      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/data');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <h1>Mapua Lab — Upload XLSX</h1>
      <form onSubmit={handleUpload}>
        <input 
          type="file" 
          accept=".xlsx,.xls" 
          onChange={e => setFile(e.target.files[0])} 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      <hr />
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Load Stored Data'}
      </button>
      <pre className="output">
        {result ? JSON.stringify(result, null, 2) : 'No result yet'}
      </pre>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login';
  };

  return (
    <Router>
      {isAuthenticated && (
        <nav>
          <ul>
            <li>
              <Link to="/">Upload XLSX</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </nav>
      )}
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <FileUploadPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <LibraryAdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}