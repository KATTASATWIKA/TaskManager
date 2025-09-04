const mongoose = require('mongoose');


const TaskListSchema = new mongoose.Schema({
board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', index: true },
title: { type: String, required: true },
taskOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
}, { timestamps: true });


module.exports = mongoose.model('TaskList', TaskListSchema);