const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Trust proxy for Render/Netlify to set secure cookies over HTTPS
app.set('trust proxy', 1);

app.use(cors({
	origin: 'https://taskmanagement15.netlify.app',
	credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'TaskManager API is running!', status: 'success' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/boards', require('./routes/boards'));
app.use('/api/lists', require('./routes/lists'));
app.use('/api/tasks', require('./routes/tasks'));

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kanban-task-manager';
mongoose.connect(mongoUri).then(() => {
	console.log('Connected to MongoDB');
	const port = process.env.PORT || 5000;
	app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch(err => {
	console.error('MongoDB connection error:', err);
	process.exit(1);
});