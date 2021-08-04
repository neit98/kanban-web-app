const express = require('express');
const router = express.Router();

const Tag = require('../models/Tag');

router.post('/', async (req, res) => {
  try {
    const tag = new Tag({
      name: 'Tag 1',
    });
    await tag.save();
    res.status(201).json({ success: true, message: tag });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
