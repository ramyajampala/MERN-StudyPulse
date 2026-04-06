import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://mern-studypulse-2.onrender.com/api/auth/register', formData);
      alert("Account created successfully! Please login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="register-card">
        <h2>Join StudyPulse</h2>
        <p>Start your journey toward focused learning.</p>
        <form onSubmit={handleRegister}>
          <div className="input-box">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
              required 
            />
          </div>
          <div className="input-box">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>
          <div className="input-box">
            <label>Create Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
          </div>
          <button type="submit" className="register-btn">Create Account</button>
        </form>
        <p className="switch-text">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;