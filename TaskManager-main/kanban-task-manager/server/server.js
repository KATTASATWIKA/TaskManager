const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(cors({
	origin: process.env.CLIENT_URL || 'http://localhost:5173',
	credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', require('./routes/auth'));
app.use('/boards', require('./routes/boards'));
app.use('/lists', require('./routes/lists'));
app.use('/tasks', require('./routes/tasks'));

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kanban-task-manager';
mongoose.connect(mongoUri).then(() => {
	console.log('Connected to MongoDB');
	const port = process.env.PORT || 5000;
	app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch(err => {
	console.error('MongoDB connection error:', err);
	process.exit(1);
});