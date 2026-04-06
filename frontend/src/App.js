import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './Pages/Dashboard';
import StudySession from './Pages/StudyRoom';
import Login from './Pages/Login';
import Register from './Pages/Register'; // 👈 ADD THIS

function App() {
  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem('studyPulse_Plan');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (schedule) {
      localStorage.setItem('studyPulse_Plan', JSON.stringify(schedule));
    }
  }, [schedule]);

  const markDayComplete = (dayNumber) => {
    setSchedule(prev => 
      prev.map(item => 
        item.day === parseInt(dayNumber) ? { ...item, status: 'completed' } : item
      )
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* 🔥 ADD THIS ROUTE */}
        <Route path="/register" element={<Register />} />

        <Route 
          path="/dashboard" 
          element={<Dashboard schedule={schedule} setSchedule={setSchedule} />} 
        />
        <Route 
          path="/study-session/:day" 
          element={<StudySession markDayComplete={markDayComplete} />} 
        />
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;