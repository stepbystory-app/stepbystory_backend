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

  try {
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

  } catch (err) {
    // Log Axios error details
    console.error('🔥 Axios error message:', err.message);
    if (err.response) {
      console.error('🔥 HTTP status:', err.response.status);
      console.error('🔥 Response body:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('🔥 No response received (network error?)');
    }

    // Extract a clear error message
    const msg = err.response?.data?.error?.message
              || err.message
              || 'Unknown OpenAI error';
    throw new Error(msg);
  }
}

module.exports = { generateStory };