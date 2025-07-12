const axios = require('axios');
const FormData = require('form-data');
const { Readable } = require('stream');
require('dotenv').config();

function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

async function transcribe(file) {
  const form = new FormData();
  const audioStream = bufferToStream(file.data);
  form.append('file', audioStream, {
    filename: file.name,
    contentType: file.mimetype
  });
  form.append('model', 'whisper-1');
  form.append('language', 'en');

  try {
    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
    return response.data.text;
  } catch (error) {
    console.error('Whisper API error:', error.response?.data || error.message);
    return '⚠️ Whisper transcription failed.';
  }
}

module.exports = {
  transcribe,
  transcribeYouTube: async (url) => {
    return 'Transcription from YouTube not yet implemented.';
  }
};