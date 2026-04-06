import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PlanPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the schedule we passed through navigate(..., { state })
  const schedule = location.state?.schedule || [];

  if (schedule.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2>No plan found.</h2>
        <button onClick={() => navigate('/')} className="text-blue-500 underline">Go back</button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Day-wise Schedule</h1>
      <div className="grid gap-4">
        {schedule.map((day, index) => (
          <div key={index} className="bg-white border-l-4 border-blue-500 p-4 shadow rounded flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Day {index + 1}: {day.topic}</h3>
              <p className="text-gray-600">Focus: {day.description || "Core concepts"}</p>
            </div>
            <button 
              onClick={() => navigate(`/study-room/${day.id}`)}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200"
            >
              Start Study
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanPage;