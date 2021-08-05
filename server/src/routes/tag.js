const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

const Tag = require('../models/Tag');

// @route GET api/tags
// @desc Get tags
// @access Private
router.get('/', verifyToken, async (req, res) => {
  try {
    const tags = await Tag.find({});

    if (!tags) {
      return res
        .status(404)
        .json({ success: false, message: 'Tags not found' });
    }

    res.json({ success: true, tags });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route GET api/tags
// @desc Get tag
// @access Private
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ success: false, message: 'Tag not found' });
    }
    res.json({ success: true, tag });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// @route POST api/tags
// @desc Create tags
// @access Private
router.post('/', verifyToken, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res
      .status(404)
      .json({ success: false, message: 'Name is required' });
  }
  try {
    const duplicateTag = await Tag.findOne({ name: name.trim() });

    if (duplicateTag) {
      return res
        .status(404)
        .json({ success: false, message: 'Tag is duplicated' });
    }
    const tag = new Tag({
      name,
    });
    await tag.save();
    res.status(201).json({ success: true, message: tag });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT api/tags
// @desc Update tag
// @access Private
router.post('/:id', verifyToken, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: 'name is required' });
  }

  try {
    const existed = await Tag.findOne({ name: name });

    if (existed) {
      return res
        .status(404)
        .json({ success: false, message: 'name is duplicated' });
    }

    let updateTag = { name };
    updatedTag = await Tag.findOneAndUpdate({ _id: req.params.id }, updateTag, {
      new: true,
    });

    if (!updateTag) {
      return res.status(401).json({
        success: false,
        message: 'Tag not found or user not authorized',
      });
    }

    res.json({ success: true, tag: updateTag });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route DELETE api/tags
// @desc Delete tag
// @access Private
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const delTask = await Tag.findOneAndDelete({ _id: req.params.id });
    // TODO: check tasks involve del tag
    if (!delTask) {
      return res.status(404).json({ success: false, message: 'Tag not found' });
    }

    res.json({ success: true, tag: delTask });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
