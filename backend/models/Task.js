const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
    title: String,
    date: Date,
    status: {
        type: String,
        enum: ["pending", "completed", "missed"],
        default: "pending"
    },
    // NEW: For user explanation after study session
    userExplanation: { type: String },
    
    verificationQuestions: [{
        question: String,
        correctAnswer: String,
        userAnswer: String,
        isCorrect: Boolean
    }],
    
    // Tracking for camera/mouse focus
    mouseMovementScore: { type: Number, default: 0 },
    focusScore: { type: Number, default: 0 } 
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);