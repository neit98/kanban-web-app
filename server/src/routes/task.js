const express = require('express');
const router = express.Router();
const appConst = require('../../utilities/constant');
const Task = require('../models/Task');
const { verifyToken } = require('../middleware/auth');

// @route GET api/tasks
// @desc Get tasks
// @access Private
router.get('/', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).populate('user', [
      'email',
    ]);
    res.json({ success: true, tasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route POST api/tasks
// @desc Create tasks
// @access Private
router.post('/', verifyToken, async (req, res) => {
  const { title, description, type } = req.body;

  if (!title) {
    return res
      .status(400)
      .json({ success: false, message: 'Title is required' });
  }

  if (description.length > 150) {
    return res
      .status(400)
      .json({ success: false, message: 'Description is too long' });
  }

  try {
    const newTask = new Task({
      title,
      description,
      type: type ?? appConst.TODO,
      user: req.userId,
    });

    await newTask.save();
    res.json({ success: true, message: 'Create successfully', task: newTask });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route PATCH api/tasks
// @desc Update tasks
// @access Private
router.patch('/:id', verifyToken, async (req, res) => {
  const { type } = req.body;
  const allowedType = [appConst.TODO, appConst.INPROGRESS, appConst.COMPLETED];

  if (type && !allowedType.includes(type)) {
    return res
      .status(400)
      .json({ success: false, message: 'Type is incorrect' });
  }

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or user not authorized',
      });
    }

    res.json({
      success: true,
      message: 'Update successfully',
      post: updatedTask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route DELETE api/posts
// @desc Delete post
// @access Private
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const delTaskCondition = { _id: req.params.id, user: req.userId };
    const delTask = await Task.findOneAndDelete(delTaskCondition);

    if (!delTask) {
      return res.status(401).json({
        success: false,
        message: 'Task not found or user not authorized',
      });
    }

    res.json({ success: true, task: delTask });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;