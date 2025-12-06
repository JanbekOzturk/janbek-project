// routes/lessons.js
const express = require('express');
const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');

const router = express.Router();

/**
 * GET /api/lessons
 * Returns all lessons.
 */
router.get('/', async (req, res) => {
  try {
    const col = getCollection('lessons');
    const lessons = await col.find({}).toArray();
    res.json(lessons);
  } catch (err) {
    console.error('Error in GET /api/lessons:', err);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

/**
 * GET /api/lessons/:id
 * Get a single lesson by id.
 */
router.get('/:id', async (req, res) => {
  try {
    const col = getCollection('lessons');
    const lesson = await col.findOne({ _id: new ObjectId(req.params.id) });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (err) {
    console.error('Error in GET /api/lessons/:id:', err);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

/**
 * PUT /api/lessons/:id
 * Update the "space" field (available places) for a lesson.
 *
 * Body:
 * {
 *   "space": 8
 * }
 */
router.put('/:id', async (req, res) => {
  try {
    const { space } = req.body;

    // allow 0 but not undefined/null
    if (space === undefined || space === null) {
      return res.status(400).json({ error: 'New space value is required' });
    }

    const col = getCollection('lessons');

    const result = await col.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { space: Number(space) } } // here we update the space available.
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json({ message: 'Lesson updated successfully' });
  } catch (err) {
    console.error('Error in PUT /api/lessons/:id:', err);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

module.exports = router;
