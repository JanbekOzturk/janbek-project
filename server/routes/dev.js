// routes/dev.js
const express = require('express');
const router = express.Router();
const { getCollection } = require('../db');

router.post('/seed-lessons', async (req, res) => {
  try {
    const lessons = [
      {
        title: 'Lego Robotics',
        category: 'technology',
        location: 'Hendon',
        price: 90,
        space: 5,
        description: 'Build and program LEGO robots with sensors. Races, maze challenges, and team missions each week.',
        image: 'lego.jpg'
      },
      {
        title: 'Creative Art Club',
        category: 'art',
        location: 'Colindale',
        price: 70,
        space: 5,
        description: 'Paint, collage, and clay! Learn color mixing, texture, and try mini-projects you can take home.',
        image: 'art.jpg'
      },
      {
        title: 'Junior Coding',
        category: 'technology',
        location: 'Brent Cross',
        price: 100,
        space: 5,
        description: 'Start with Scratch and move to simple web pages. Make mini-games while learning logic step by step.',
        image: 'coding.jpg'
      },
      {
        title: 'Football Training',
        category: 'sports',
        location: 'Golders Green',
        price: 60,
        space: 5,
        description: 'Dribbling, passing, shooting, and teamwork drills. Friendly mini-matches every session.',
        image: 'football.jpg'
      },
      {
        title: 'Music Band Practice',
        category: 'music',
        location: 'Hendon',
        price: 80,
        space: 5,
        description: 'Try drums, keys, guitar, and singing. Learn rhythm and play easy songs together as a band.',
        image: 'music.jpg'
      },
      {
        title: 'Dance & Movement',
        category: 'dance',
        location: 'Colindale',
        price: 75,
        space: 5,
        description: 'Hip-hop and jazz basics with fun warm-ups, simple choreography, and confidence on stage.',
        image: 'dance.jpg'
      },
      {
        title: 'Cooking for Kids',
        category: 'cooking',
        location: 'Brent Cross',
        price: 65,
        space: 5,
        description: 'Measure, mix, and bake simple recipes safely. Learn kitchen rules and make a snack each week.',
        image: 'cooking.jpg'
      },
      {
        title: 'Drama & Acting',
        category: 'drama',
        location: 'Hendon',
        price: 85,
        space: 5,
        description: 'Improv games, voice projection, and short scenes. Build confidence and perform mini-skits.',
        image: 'drama.jpg'
      },
      {
        title: 'Science Experiments',
        category: 'science',
        location: 'Colindale',
        price: 95,
        space: 5,
        description: 'Safe, hands-on experiments: slime, rockets, circuits, and physics demos that explain how things work.',
        image: 'science.jpg'
      },
      {
        title: 'Art of Comics',
        category: 'art',
        location: 'Hendon',
        price: 70,
        space: 5,
        description: 'Create characters, storyboards, and panels. Learn inking and speech bubbles for your own mini-comic.',
        image: 'comic.jpg'
      },
      {
        title: 'Nature Explorers',
        category: 'outdoor',
        location: 'Brent Cross',
        price: 55,
        space: 5,
        description: 'Outdoor discovery: plant and bug ID, mini-terrariums, compass skills, and eco-friendly crafts.',
        image: 'nature.jpg'
      },
      {
        title: 'Board Games Club',
        category: 'games',
        location: 'Colindale',
        price: 50,
        space: 5,
        description: 'Strategy and co-op games, friendly tournaments, and design a simple board game with friends.',
        image: 'boardgame.jpg'
      }
    ];

    const col = getCollection('lessons');

    // Clear existing docs so the seed is repeatable
    await col.deleteMany({});

    const result = await col.insertMany(lessons);

    res.json({
      insertedCount: result.insertedCount,
      ids: Object.values(result.insertedIds)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
