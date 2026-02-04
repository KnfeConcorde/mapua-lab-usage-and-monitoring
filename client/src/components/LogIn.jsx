import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogIn.css';
import mapuaLogo from '../assets/Mapua Logo.png';
import nameLogo from '../assets/Name Logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Replace with your actual API endpoint
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store authentication token/status
        localStorage.setItem('isAuthenticated', 'true');
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        // Redirect to dashboard or home
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="left-pane">
          <div className="logo-stack">
            <img src={mapuaLogo} alt="Mapua Logo" className="mapua-logo" />
            <img src={nameLogo} alt="Name Logo" className="name-logo" />
          </div>
        </div>
        <div className="right-pane">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <div className="error-message">{error}</div>}
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;