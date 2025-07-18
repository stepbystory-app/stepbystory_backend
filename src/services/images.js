// src/services/images.js
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY');
}

const IMAGE_URL = 'https://api.openai.com/v1/images/generations';

async function generateImage(prompt) {
  const res = await axios.post(
    IMAGE_URL,
    {
      prompt,
      n: 1,
      size: '256x256'
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      }
    }
  );

  const url = res.data.data?.[0]?.url;
  if (!url) throw new Error('No image URL returned');
  return url;
}

module.exports = { generateImage };