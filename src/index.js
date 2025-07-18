const express = require('express');
const cors = require('cors');
const { generateStory } = require('./services/openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── The /generate Endpoint ────────────────────────────────────────
app.post('/generate', async (req, res) => {
  try {
    const { steps, tone } = req.body;
    if (!Array.isArray(steps) || !tone) {
      return res.status(400).send({ error: 'steps (array) and tone (string) required' });
    }
    const story = await generateStory(steps, tone); // from services/openai.js
    res.send({ story });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).send({ error: 'Failed to generate story' });
  }
});
// ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));