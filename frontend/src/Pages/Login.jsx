import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://mern-studypulse-2.onrender.com/api/auth/login', {
        email: email.trim().toLowerCase(),
        password
      });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="login-container">
        <h2>StudyPulse</h2>
        <p>Focus. Practice. Master.</p>
        <form onSubmit={handleLogin}>
          <div className="input-box">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-box">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="switch-text">
          Don't have an account <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;