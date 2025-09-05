// routes/boards.js (excerpt)
const router = require('express').Router();
const auth = require('../middleware/auth');
const Board = require('../models.js/Board');
const TaskList = require('../models.js/TaskList');
const Task = require('../models.js/Task');
const geminiService = require('../services/geminiService');


router.use(auth);


router.get('/', async (req,res) => {
const boards = await Board.find({ owner: req.userId }).select('title description createdAt updatedAt listOrder');
res.json(boards);
});


router.post('/', async (req,res) => {
const board = await Board.create({ owner: req.userId, title: req.body.title, description: req.body.description, listOrder: [] });

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
const { title, description, listOrder } = req.body;
const board = await Board.findOneAndUpdate(
{ _id: req.params.id, owner: req.userId },
{ ...(title !== undefined && { title }), ...(description !== undefined && { description }), ...(listOrder !== undefined && { listOrder }) },
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

// POST /boards/ai-generate
router.post('/ai-generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    // Generate board structure using Gemini AI
    const aiBoardData = await geminiService.generateBoardStructure(prompt.trim());
    
    // Create the board
    const board = await Board.create({
      owner: req.userId,
      title: aiBoardData.boardTitle,
      description: aiBoardData.boardDescription,
      listOrder: []
    });

    const createdLists = [];
    const createdTasks = [];

    // Create lists and tasks
    for (const listData of aiBoardData.lists) {
      const list = await TaskList.create({
        board: board._id,
        title: listData.title,
        taskOrder: []
      });
      
      board.listOrder.push(list._id);
      createdLists.push(list);

      // Create tasks for this list
      for (const taskData of listData.tasks) {
        const task = await Task.create({
          board: board._id,
          list: list._id,
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority || 'medium',
          dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
          labels: taskData.labels || [],
          subtasks: taskData.subtasks || []
        });
        
        list.taskOrder.push(task._id);
        createdTasks.push(task);
      }
      
      await list.save();
    }

    await board.save();

    res.status(201).json({
      board,
      lists: createdLists,
      tasks: createdTasks,
      message: 'AI-generated board created successfully'
    });

  } catch (error) {
    console.error('AI Board Generation Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: 'Failed to generate AI board',
      error: error.message 
    });
  }
});

// POST /boards/:id/ai-suggest-tasks
router.post('/:id/ai-suggest-tasks', async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, owner: req.userId });
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const currentTasks = await Task.find({ board: board._id });
    const suggestions = await geminiService.generateTaskSuggestions(board.title, currentTasks);

    res.json({ suggestions });
  } catch (error) {
    console.error('AI Task Suggestions Error:', error);
    res.status(500).json({ 
      message: 'Failed to generate task suggestions',
      error: error.message 
    });
  }
});

module.exports = router;