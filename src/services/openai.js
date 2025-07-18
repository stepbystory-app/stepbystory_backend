const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

async function generateStory(steps, tone) {
  const prompt = `
Create a ${tone} adventure story for a child. Use the following routine steps as chapters:
${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
Story:
`;

  const response = await axios.post(
    OPENAI_URL,
    {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a creative assistant that writes fun, child-friendly stories.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      }
    }
  );

  const story = response.data.choices?.[0]?.message?.content;
  if (!story) throw new Error('No content returned from OpenAI');
  return story.trim();
}

module.exports = { generateStory };