const Plan = require("../models/Plan");
const Task = require("../models/Task");

exports.createPlan = async (req, res) => {
    try {
        const { syllabus, examDate } = req.body;
        const userId = req.user.id;

        // 1. Calculate Days available (End date - 5 days)
        const today = new Date();
        const exam = new Date(examDate);
        const diffTime = exam - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 5;

        if (diffDays <= 0) {
            return res.status(400).json({ message: "Exam date is too close to allow a 5-day buffer!" });
        }

        // 2. AI Logic (Simplified for now - you can call Gemini API here)
        // Instead of just split(','), imagine this is the output of an AI breakdown
        const topics = syllabus.split(",").map(t => t.trim());
        const perDay = Math.ceil(topics.length / diffDays);

        const plan = await Plan.create({ userId, syllabus, examDate });

        // 3. Generate Tasks
        let tasks = [];
        topics.forEach((topic, index) => {
            const dayOffset = Math.floor(index / perDay);
            const taskDate = new Date();
            taskDate.setDate(today.getDate() + dayOffset);

            tasks.push({
                userId,
                planId: plan._id,
                title: topic,
                date: taskDate,
                // Add an empty array for AI questions to be filled later
                verificationQuestions: [
                    { question: `Summarize the key points of ${topic}`, answer: "" }
                ]
            });
        });

        await Task.insertMany(tasks);
        res.status(201).json({ message: "AI Plan Created", plan });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};