import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

const StudySession = ({ markDayComplete }) => {
  const { day } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(3); 
  const [isActive, setIsActive] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [tabWarning, setTabWarning] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Camera Logic (Warning-Free)
  useEffect(() => {
    const currentVideoElement = videoRef.current;
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (currentVideoElement) {
          currentVideoElement.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    }
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (currentVideoElement) {
        currentVideoElement.srcObject = null;
      }
    };
  }, []);

  // Tab Protection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsActive(false);
        setTabWarning(true);
      } else {
        setTabWarning(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setSessionFinished(true);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleFinalSubmit = () => {
    if (userAnswer.trim().length < 50) {
      alert("Please provide a more detailed summary (min 50 chars).");
      return;
    }
    markDayComplete(day);
    navigate('/dashboard');
  };

  // Inline Styles for a Professional Look
  const styles = {
    container: {
      padding: '40px 20px',
      minHeight: '100vh',
      backgroundColor: '#f0f4f8',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      justifyContent: 'center'
    },
    card: {
      maxWidth: '800px',
      width: '100%',
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
      padding: '40px',
      textAlign: 'center'
    },
    header: {
      color: '#1a202c',
      fontSize: '28px',
      fontWeight: '800',
      marginBottom: '8px'
    },
    topicBadge: {
      display: 'inline-block',
      padding: '6px 16px',
      backgroundColor: '#ebf4ff',
      color: '#3182ce',
      borderRadius: '50px',
      fontSize: '14px',
      fontWeight: '600',
      textTransform: 'uppercase',
      marginBottom: '30px'
    },
    videoWrapper: {
      position: 'relative',
      width: '100%',
      maxWidth: '480px',
      aspectRatio: '4/3',
      margin: '0 auto 30px',
      borderRadius: '20px',
      overflow: 'hidden',
      backgroundColor: '#2d3748',
      border: '8px solid #f7fafc',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    timerDisplay: {
      fontSize: '84px',
      fontWeight: '900',
      fontVariantNumeric: 'tabular-nums',
      color: timeLeft === 0 ? '#38a169' : '#2d3748',
      margin: '20px 0',
      letterSpacing: '-2px'
    },
    button: {
      padding: '16px 48px',
      fontSize: '18px',
      fontWeight: '700',
      borderRadius: '16px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: isActive ? '#e53e3e' : '#3182ce',
      color: '#fff',
      boxShadow: '0 10px 15px -3px rgba(49, 130, 206, 0.3)'
    },
    warning: {
      backgroundColor: '#fff5f5',
      color: '#c53030',
      padding: '12px',
      borderRadius: '12px',
      border: '1px solid #feb2b2',
      marginBottom: '20px',
      fontSize: '14px',
      fontWeight: '600'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.header}>Day {day} Study Session</h1>
        <div style={styles.topicBadge}>{state?.topic || "Deep Work"}</div>

        <div style={styles.videoWrapper}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
          {!isActive && !sessionFinished && (
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: '600' }}>
              Focus Paused
            </div>
          )}
        </div>

        {tabWarning && <div style={styles.warning}>⚠️ Don't leave! Tab switching pauses your progress.</div>}

        <div style={styles.timerDisplay}>{formatTime(timeLeft)}</div>

        {!sessionFinished ? (
          <button 
            style={styles.button}
            onClick={() => setIsActive(!isActive)}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            {isActive ? 'Pause Focus' : 'Start Studying'}
          </button>
        ) : (
          <div style={{ textAlign: 'left', animation: 'fadeIn 0.5s ease-in' }}>
            <h3 style={{ color: '#38a169', marginBottom: '10px' }}>✓ Time Finished!</h3>
            <p style={{ color: '#4a5568', marginBottom: '15px', fontSize: '15px' }}>Explain your practice in detail below to verify completion.</p>
            <textarea 
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Minimum 50 characters required..."
              style={{ width: '100%', height: '120px', padding: '15px', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '16px', marginBottom: '20px', outline: 'none' }}
            />
            <button 
              onClick={handleFinalSubmit}
              style={{ ...styles.button, backgroundColor: '#2d3748', width: '100%' }}
            >
              Verify & Mark Complete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudySession;