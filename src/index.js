require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { generateStory } = require('./services/openai');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.post('/generate', async (req, res) => {
  const { steps, tone } = req.body;
  if (!Array.isArray(steps) || !tone) {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  try {
    const story = await generateStory(steps, tone);
    return res.json({ story });
  } catch (err) {
    // Log and forward the error message
    console.error('❌ Error generating story:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});