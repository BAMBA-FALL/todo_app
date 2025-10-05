const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET toutes les tâches
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST créer une tâche
router.post('/', async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT modifier une tâche
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await task.update({
      title: req.body.title || task.title,
      completed: req.body.completed !== undefined ? req.body.completed : task.completed
    });
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE supprimer une tâche
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;