import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initDevUser, findUser, verifyPassword } from '../utils/auth';
import './LogIn.css';
import mapuaLogo from './assets/Mapua Logo.png';
import nameLogo from './assets/Name Logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize development user on component mount
  useEffect(() => {
    initDevUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Find user in local storage
      const user = findUser(username);
      
      if (!user) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      // Verify password against hash
      const isValid = await verifyPassword(password, user.passwordHash);
      
      if (isValid) {
        // Store authentication status and user info
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
          username: user.username,
          role: user.role
        }));
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
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
              autoComplete="username"
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              autoComplete="current-password"
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