const mongoose = require('mongoose');

const PlanSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startDate: Date,
  endDate: Date,
  dailySchedule: [{
    dayNumber: Number,
    date: Date,
    isCompleted: { type: Boolean, default: false },
    status: { type: String, default: 'pending' }
  }]
});

module.exports = mongoose.model('PlanSession', PlanSessionSchema);