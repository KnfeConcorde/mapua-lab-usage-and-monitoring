import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initDevUser, findUser, verifyPassword } from "../utils/auth";
import "./LogIn.css";
import logoImg from "./assets/_img_2.png";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initDevUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = findUser(username);
      if (!user) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("currentUser", JSON.stringify({ username: user.username, role: user.role }));
      navigate("/dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="viewport">
      <div className="login-card">
        
        {/* Left Side: Branding and Form */}
        <div className="panel left-panel">
          <div className="logo-section">
            {/* Replace with your local logo path */}
            <img src={logoImg} alt="Mapúa University" className="main-logo" />
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="error-box">{error}</div>}
            <input
              type="text"
              className="styled-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              className="styled-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="action-row">
              <button type="submit" className="signin-btn" disabled={loading}>
                {loading ? "..." : "Sign In"}
              </button>
              <div className="account-text">
                <p>No account?</p>
                <p>Contact an admin</p>
              </div>
            </div>
          </form>

          <div className="footer-section">
            <p>© 1997-2026 Laboratory Usage. All Rights Reserved. | Mapua e101</p>
            <div className="footer-links">
              <a href="#help">Help</a>
              <span>|</span>
              <a href="#terms">Terms of Use</a>
              <span>|</span>
              <a href="#contact">Contact Us</a>
            </div>
          </div>
        </div>

        {/* Right Side: Announcements */}
        <div className="panel right-panel">
          <h1 className="header-text" style={{ alignItems: "center" }}>ANNOUNCEMENTS</h1>
          <div className="bars-container">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="news-bar" />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}