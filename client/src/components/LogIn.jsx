import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogIn.css';
import mapuaLogo from './assets/Mapua Logo.png';
import nameLogo from './assets/Name Logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hardcoded credentials for development
  const DEV_CREDENTIALS = {
    username: 'admin',
    password: 'mapua@1925'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (username === DEV_CREDENTIALS.username && password === DEV_CREDENTIALS.password) {
        // Store authentication status
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', username);
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 500);
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