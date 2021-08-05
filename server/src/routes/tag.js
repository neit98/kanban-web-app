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
    console.log(duplicateTag);

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
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
