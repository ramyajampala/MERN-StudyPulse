const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    syllabus: String,
    examDate: Date
}, { timestamps: true });

module.exports = mongoose.model("Plan", planSchema);