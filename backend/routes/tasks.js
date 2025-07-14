const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();

// GET /api/tasks - Get all tasks for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tasks - Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      user: req.user.id
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', auth, async (req, res) => {
    try {
      const { title, description, status, priority, dueDate } = req.body;
      
      // Find task and ensure it belongs to the current user
      let task = await Task.findOne({ _id: req.params.id, user: req.user.id });
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Update task fields
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.dueDate = dueDate || task.dueDate;
  
      const updatedTask = await task.save();
      res.json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  });
  
  // DELETE /api/tasks/:id - Delete a task
  router.delete('/:id', auth, async (req, res) => {
    try {
      const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      await Task.findByIdAndDelete(req.params.id);
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // GET /api/tasks/:id - Get a single task
  router.get('/:id', auth, async (req, res) => {
    try {
      const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;