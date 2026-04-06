import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateDayStatus } from '../planSession';

const SessionTimer = ({ planId, dayId }) => {
    const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes
    const navigate = useNavigate();

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else {
            handleSessionComplete();
        }
    }, [timeLeft]);

    const handleSessionComplete = async () => {
        try {
            await updateDayStatus(planId, dayId, true);
            navigate('/dashboard'); // Automatic redirection
        } catch (error) {
            console.error("Auto-completion failed:", error);
        }
    };

    const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    return (
        <div className="timer-view">
            <h2>Focus Session Active</h2>
            <div className="timer-display">{formatTime(timeLeft)}</div>
            <p>You will be redirected to the dashboard once the session ends.</p>
        </div>
    );
};

export default SessionTimer