const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { timestamps, defaultOptions, userId } = require('../../constants/db.constant');

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, required: true },
    userId,
  },
  {
    ...defaultOptions,
    timestamps,
  }
);

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
