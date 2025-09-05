const router = require('express').Router();
const auth = require('../middleware/auth');
const Board = require('../models.js/Board');
const TaskList = require('../models.js/TaskList');
const Task = require('../models.js/Task');

router.use(auth);

// POST /lists/:listId/tasks
router.post('/lists/:listId/tasks', async (req,res) => {
	console.log('Creating task for list:', req.params.listId, 'with body:', req.body);
	const { title, description, dueDate, priority, labels, subtasks } = req.body;
	const list = await TaskList.findById(req.params.listId).populate('board');
	console.log('Found list:', list);
	if (!list || String(list.board.owner) !== req.userId) return res.status(404).json({ message: 'List not found' });
	if (!title) return res.status(400).json({ message: 'Title is required' });
	const task = await Task.create({
		board: list.board._id,
		list: list._id,
		title,
		description,
		dueDate: dueDate ? new Date(dueDate) : undefined,
		priority: priority || 'medium',
		labels: labels || [],
		subtasks: Array.isArray(subtasks) ?
			subtasks.map(s => {
				const t = String((s && s.title) || '').trim();
				return t ? { title: t, done: !!s.done } : null;
			}).filter(Boolean) : [],
	});
	console.log('Task created:', task);
	list.taskOrder.push(task._id);
	await list.save();
	console.log('List updated with new task');
	res.status(201).json(task);
});

// PATCH /tasks/:taskId
router.patch('/:taskId', async (req,res) => {
	const { title, description, dueDate, priority, labels, subtasks, list: newListId } = req.body;
	const task = await Task.findById(req.params.taskId).populate('board');
	if (!task || String(task.board.owner) !== req.userId) return res.status(404).json({ message: 'Task not found' });
	const update = {};
	if (title !== undefined) update.title = title;
	if (description !== undefined) update.description = description;
	if (dueDate !== undefined) update.dueDate = dueDate ? new Date(dueDate) : null;
	if (priority !== undefined) update.priority = priority;
	if (labels !== undefined) update.labels = labels;
	if (subtasks !== undefined) update.subtasks = Array.isArray(subtasks)
		? subtasks.map(s => {
			const t = String((s && s.title) || '').trim();
			return t ? { title: t, done: !!s.done } : null;
		}).filter(Boolean)
		: [];
	if (newListId !== undefined) update.list = newListId;
	const updated = await Task.findByIdAndUpdate(req.params.taskId, update, { new: true });
	if (newListId && String(newListId) !== String(task.list)) {
		await TaskList.updateOne({ _id: task.list }, { $pull: { taskOrder: task._id } });
		await TaskList.updateOne({ _id: newListId }, { $push: { taskOrder: task._id } });
	}
	res.json(updated);
});

// DELETE /tasks/:taskId
router.delete('/:taskId', async (req,res) => {
	const task = await Task.findById(req.params.taskId).populate('board');
	if (!task || String(task.board.owner) !== req.userId) return res.status(404).json({ message: 'Task not found' });
	await TaskList.updateOne({ _id: task.list }, { $pull: { taskOrder: task._id } });
	await Task.deleteOne({ _id: task._id });
	res.status(204).end();
});

module.exports = router;
