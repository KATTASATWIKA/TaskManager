// routes/boards.js (excerpt)
const router = require('express').Router();
const auth = require('../middleware/auth');
const Board = require('../models.js/Board');
const TaskList = require('../models.js/TaskList');
const Task = require('../models.js/Task');


router.use(auth);


router.get('/', async (req,res) => {
const boards = await Board.find({ owner: req.userId }).select('title createdAt updatedAt listOrder');
res.json(boards);
});


router.post('/', async (req,res) => {
const board = await Board.create({ owner: req.userId, title: req.body.title, listOrder: [] });

// Return empty board - user can create lists by clicking "Add List"
res.status(201).json({ board, lists: [] });
});


router.get('/:id', async (req,res) => {
const board = await Board.findOne({ _id: req.params.id, owner: req.userId });
if (!board) return res.status(404).json({ message: 'Not found' });
const lists = await TaskList.find({ board: board._id }).sort({ createdAt: 1 });
const tasks = await Task.find({ board: board._id });
res.json({ board, lists, tasks });
});


router.patch('/:id', async (req,res) => {
const { title, listOrder } = req.body;
const board = await Board.findOneAndUpdate(
{ _id: req.params.id, owner: req.userId },
{ ...(title !== undefined && { title }), ...(listOrder !== undefined && { listOrder }) },
{ new: true }
);
if (!board) return res.status(404).json({ message: 'Not found' });
res.json(board);
});

// DELETE /boards/:id
router.delete('/:id', async (req,res) => {
const board = await Board.findOne({ _id: req.params.id, owner: req.userId });
if (!board) return res.status(404).json({ message: 'Not found' });
await Task.deleteMany({ board: board._id });
await TaskList.deleteMany({ board: board._id });
await Board.deleteOne({ _id: board._id });
res.status(204).end();
});

// POST /boards/:id/lists
router.post('/:id/lists', async (req,res) => {
const board = await Board.findOne({ _id: req.params.id, owner: req.userId });
if (!board) return res.status(404).json({ message: 'Board not found' });
const list = await TaskList.create({ board: board._id, title: req.body.title, taskOrder: [] });
board.listOrder.push(list._id);
await board.save();
res.status(201).json(list);
});


module.exports = router;