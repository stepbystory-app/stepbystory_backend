// src/index.js

// 1. Load env vars
require('dotenv').config();

// 2. Core modules for debugging & path resolution
const fs   = require('fs');
const path = require('path');

// 3. Third-party modules
const express = require('express');
const cors    = require('cors');

// 4. Debug: List contents of this directory
console.log('⤷ __dirname:', __dirname);
try {
  console.log('⤷ Files here:', fs.readdirSync(__dirname));
} catch (err) {
  console.error('⤷ Failed listing __dirname:', err);
}

// 5. Debug: List contents of services/
const servicesDir = path.join(__dirname, 'services');
console.log(
  '⤷ services/ exists?',
  fs.existsSync(servicesDir),
  fs.existsSync(servicesDir) ? fs.readdirSync(servicesDir) : []
);

// 6. Require your OpenAI helper via absolute path
const { generateStory } = require(path.join(servicesDir, 'openai.js'));

// 7. Express setup
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// 8. Route
app.post('/generate', async (req, res) => {
  const { steps, tone } = req.body;
  if (!Array.isArray(steps) || !tone) {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  try {
    const story = await generateStory(steps, tone);
    return res.json({ story });
  } catch (err) {
    console.error('Error in /generate handler:', err);
    return res.status(500).json({ error: 'Failed to generate story.' });
  }
});

// 9. Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});