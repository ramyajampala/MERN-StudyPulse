const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ date: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const taskId = req.params.id;

        // 1. Update the current task status
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { status },
            { new: true }
        );

        // 2. Reschedule Logic: If status is not 'completed', move it to the next day
        if (status !== 'completed') {
            const nextDay = new Date(updatedTask.date);
            nextDay.setDate(nextDay.getDate() + 1);

            await Task.create({
                userId: updatedTask.userId,
                planId: updatedTask.planId,
                title: updatedTask.title,
                date: nextDay,
                status: 'pending',
                verificationQuestions: updatedTask.verificationQuestions
            });
        }

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};