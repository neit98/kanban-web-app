const express = require('express');
const router = express.Router();
const appConst = require('../../utilities/constant');
const Task = require('../models/Task');
const Tag = require('../models/Tag');
const { verifyToken } = require('../middleware/auth');

// @route GET api/tasks
// @desc Get tasks
// @access Private
router.get('/', verifyToken, async (req, res) => {
  const taskCondition = { user: req.userId };
  req.query.type ? (taskCondition.type = req.query.type) : null;

  try {
    const tasks = await Task.find(taskCondition)
      .populate({ path: 'user', select: 'email' })
      .populate({
        path: 'tag',
        select: 'name',
      });

    res.json({ success: true, tasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route GET api/tasks
// @desc Get task
// @access Private
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, task });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route POST api/tasks
// @desc Create task
// @access Private
router.post('/', verifyToken, async (req, res) => {
  const { title, description, type, tag } = req.body;

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
    if (tag) {
      const findTag = await Tag.findOne({ _id: tag });

      if (!findTag) {
        return res
          .status(400)
          .json({ success: false, message: 'Tag not found' });
      }
    }

    const newTask = new Task({
      title,
      description,
      type: type ?? appConst.TODO,
      user: req.userId,
      tag: tag || null,
    });

    await newTask.save();
    res.json({ success: true, message: 'Create successfully', task: newTask });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route PATCH api/tasks
// @desc Update task
// @access Private
router.patch('/:id', verifyToken, async (req, res) => {
  const { type, tag } = req.body;
  const allowedType = [appConst.TODO, appConst.INPROGRESS, appConst.COMPLETED];

  if (type && !allowedType.includes(type)) {
    return res
      .status(400)
      .json({ success: false, message: 'Type is incorrect' });
  }

  try {
    if (tag) {
      const findTag = await Tag.findOne({ _id: tag });
      if (!findTag) {
        return res
          .status(400)
          .json({ success: false, message: 'Tag not found' });
      }
    }

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
