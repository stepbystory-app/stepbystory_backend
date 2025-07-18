// src/index.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const { generateChapters } = require('./services/openai');
const { generateImage }    = require('./services/images');

const app = express();

// CORS & JSON
app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { steps, tone } = req.body;
  if (!Array.isArray(steps) || !tone) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  try {
    // 1) Get chapters array from GPT
    const chapters = await generateChapters(steps, tone);

    // 2) For each chapter call DALL·E
    const chaptersWithImages = await Promise.all(
      chapters.map(async (chap) => {
        const imageUrl = await generateImage(chap.imagePrompt);
        return { ...chap, imageUrl };
      })
    );

    // 3) Return enriched chapters
    return res.json({ chapters: chaptersWithImages });

  } catch (err) {
    console.error('Error in /generate:', err);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});