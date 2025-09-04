// routes/lists.js (excerpt)
const router = require('express').Router();
const auth = require('../middleware/auth');
const Board = require('../models.js/Board');
const TaskList = require('../models.js/TaskList');
const Task = require('../models.js/Task');


router.use(auth);


router.patch('/:listId', async (req,res) => {
const { title, taskOrder } = req.body;
const list = await TaskList.findById(req.params.listId).populate('board');
if (!list || String(list.board.owner) !== req.userId) return res.status(404).json({ message: 'List not found' });
if (title !== undefined) list.title = title;
if (taskOrder !== undefined) list.taskOrder = taskOrder;
await list.save();
res.json(list);
});


router.delete('/:listId', async (req,res) => {
const list = await TaskList.findById(req.params.listId).populate('board');
if (!list || String(list.board.owner) !== req.userId) return res.status(404).json({ message: 'List not found' });
await Task.deleteMany({ list: list._id });
await list.deleteOne();
await Board.updateOne({ _id: list.board._id }, { $pull: { listOrder: list._id } });
res.status(204).end();
});


module.exports = router;