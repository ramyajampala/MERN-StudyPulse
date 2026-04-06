import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ schedule, setSchedule }) => {
  const navigate = useNavigate();
  const [syllabus, setSyllabus] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const generateSchedule = () => {
    if (!syllabus || !targetDate) return alert("Please fill in all fields!");
    const topics = syllabus.split(',').map(t => t.trim());
    const newPlan = topics.map((topic, i) => ({
      day: i + 1,
      topic: topic,
      status: 'pending'
    }));
    setSchedule(newPlan);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: "'Inter', sans-serif",
      padding: '40px 20px',
      color: '#1e293b'
    },
    headerSection: {
      textAlign: 'center',
      marginBottom: '50px'
    },
    inputCard: {
      maxWidth: '600px',
      margin: '0 auto 40px',
      backgroundColor: '#ffffff',
      padding: '30px',
      borderRadius: '20px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    input: {
      padding: '12px 16px',
      borderRadius: '10px',
      border: '1px solid #e2e8f0',
      fontSize: '15px',
      outline: 'none',
      transition: 'border-color 0.2s'
    },
    button: {
      padding: '14px',
      backgroundColor: '#3b82f6',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    dayCard: (isCompleted) => ({
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '20px',
      border: `2px solid ${isCompleted ? '#bbf7d0' : '#f1f5f9'}`,
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
    }),
    badge: (isCompleted) => ({
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '50px',
      fontSize: '12px',
      fontWeight: '700',
      backgroundColor: isCompleted ? '#dcfce7' : '#f1f5f9',
      color: isCompleted ? '#166534' : '#64748b',
      textTransform: 'uppercase'
    })
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '10px' }}>StudyPulse</h1>
        <p style={{ color: '#64748b' }}>Your disciplined path to mastering the syllabus.</p>
      </div>

      {!schedule ? (
        <div style={styles.inputCard}>
          <h3 style={{ margin: 0 }}>Create New Plan</h3>
          <input 
            type="date" 
            style={styles.input} 
            onChange={(e) => setTargetDate(e.target.value)} 
          />
          <textarea 
            placeholder="Enter topics separated by commas (e.g. React Hooks, Node.js, Auth...)" 
            style={{ ...styles.input, height: '100px', resize: 'none' }}
            onChange={(e) => setSyllabus(e.target.value)}
          />
          <button 
            style={styles.button}
            onClick={generateSchedule}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            Generate Study Roadmap
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {schedule.map((item) => (
            <div 
              key={item.day}
              onClick={() => navigate(`/study-session/${item.day}`, { state: { topic: item.topic } })}
              style={styles.dayCard(item.status === 'completed')}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 20px rgba(0,0,0,0.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8' }}>Day {item.day}</span>
                <div style={styles.badge(item.status === 'completed')}>
                  {item.status === 'completed' ? '✓ Completed' : 'Pending'}
                </div>
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{item.topic}</h3>
              <div style={{ marginTop: '20px', fontSize: '13px', color: '#3b82f6', fontWeight: '600' }}>
                {item.status === 'completed' ? 'Review Session →' : 'Start Focus Session →'}
              </div>
            </div>
          ))}
          
          {/* Option to reset */}
          <button 
            onClick={() => { localStorage.removeItem('studyPulse_Plan'); window.location.reload(); }}
            style={{ 
              gridColumn: '1 / -1', 
              marginTop: '40px', 
              background: 'none', 
              border: 'none', 
              color: '#94a3b8', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Reset entire plan and start over
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;