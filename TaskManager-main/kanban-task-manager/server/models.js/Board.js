const mongoose = require('mongoose');


const BoardSchema = new mongoose.Schema({
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
title: { type: String, required: true },
description: { type: String },
listOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaskList' }], // saves layout
}, { timestamps: true });


module.exports = mongoose.model('Board', BoardSchema);