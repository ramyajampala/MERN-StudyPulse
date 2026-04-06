import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import axios from "../api/axios";

const StudyRoom = ({ task }) => {
    const navigate = useNavigate();
    const webcamRef = useRef(null);

    // State
    const [seconds, setSeconds] = useState(7200); // 25 Minutes
    const [isActive, setIsActive] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [userAnswer, setUserAnswer] = useState("");

    // Timer Logic
    useEffect(() => {
        let interval = null;
        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(prev => prev - 1);
            }, 1000);
        } else if (seconds === 0) {
            clearInterval(interval);
            setIsActive(false);
            setShowQuiz(true); // Auto-show explanation when time is up
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const handleFinalSubmit = async () => {
        if (userAnswer.length < 10) {
            alert("Please provide a more detailed explanation.");
            return;
        }

        try {
            // Update backend status
            await axios.patch(`/tasks/${task._id}`, {
                status: "completed",
                userExplanation: userAnswer
            });
            
            // Redirect back to Plan Page
            navigate("/planPage");
        } catch (error) {
            console.error("Error completing session:", error);
            navigate("/planPage"); // Redirect anyway to keep flow moving
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-xl border-t-4 border-blue-600 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Session: {task?.title}</h2>

            {!showQuiz ? (
                <>
                    {/* Camera Section */}
                    <div className="my-6 rounded-lg overflow-hidden border-4 border-gray-200">
                        <Webcam audio={false} ref={webcamRef} width="100%" />
                    </div>

                    {/* Timer Section */}
                    <div className="flex items-center justify-center bg-gray-100 rounded-lg py-10 mb-6">
                        <span className="text-5xl font-mono font-bold text-blue-700">
                            {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
                        </span>
                    </div>

                    <button 
                        onClick={() => setIsActive(!isActive)}
                        className={`w-full py-3 rounded-lg font-bold text-white transition ${isActive ? 'bg-red-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {isActive ? 'Pause Session' : 'Start Focus Timer'}
                    </button>
                </>
            ) : (
                /* AI Verification / Explanation Modal style */
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-blue-200">
                    <h3 className="text-lg font-bold mb-2">Study Verification</h3>
                    <p className="text-gray-600 mb-4 text-sm">Timer completed! Explain what you learned about "{task?.title}" to finish Day 1.</p>
                    <textarea 
                        className="w-full border-2 border-gray-200 rounded p-2 focus:border-blue-500 outline-none"
                        rows="5"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your summary here..."
                    />
                    <button 
                        onClick={handleFinalSubmit}
                        className="w-full mt-4 bg-green-600 text-white font-bold py-3 rounded hover:bg-green-700 transition"
                    >
                        Verify & Complete Day
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudyRoom;