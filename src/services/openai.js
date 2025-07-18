// src/services/openai.js
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY');
}

const CHAT_URL = 'https://api.openai.com/v1/chat/completions';

async function generateChapters(steps, tone) {
  // Build a prompt that returns strict JSON
  const prompt = `
You are a storytelling assistant. Given these routine steps:
${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
Output a JSON array called "chapters". Each chapter must have:
- "title": a short, catchy title
- "text": one or two sentences about that step
- "imagePrompt": a 5–10 word description for an illustration of this step

Example response:
{
  "chapters": [
    {
      "title": "Sparkling Smile",
      "text": "Tommy brushes each tooth until they shine like stars.",
      "imagePrompt": "child brushing teeth cartoon"
    },
    …
  ]
}
`;

  const res = await axios.post(
    CHAT_URL,
    {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You output only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      }
    }
  );

  const text = res.data.choices[0].message.content.trim();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.error('Failed to parse JSON from OpenAI:', text);
    throw new Error('Invalid JSON response from story generator');
  }

  if (!Array.isArray(parsed.chapters)) {
    throw new Error('Missing "chapters" array in OpenAI response');
  }

  return parsed.chapters;
}

module.exports = { generateChapters };