import React from 'react';
import './LogIn.css';
import mapuaLogo from '../assets/Mapua Logo.png';
import nameLogo from '../assets/Name Logo.png';

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Login submitted');
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
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;