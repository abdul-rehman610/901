const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { convert } = require('html-to-text');
const whisper = require('./whisper');
const quiz = require('./quiz');

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.post('/upload', async (req, res) => {
  const file = req.files.file;
  const ext = path.extname(file.name).toLowerCase();

  let transcript = '';

  if (ext === '.pdf') {
    const data = await pdfParse(file.data);
    transcript = data.text;
  } else if (ext === '.html' || ext === '.htm') {
    transcript = convert(file.data.toString(), { wordwrap: 130 });
  } else {
    transcript = await whisper.transcribe(file);
  }

  res.json({ transcript });
});

app.post('/youtube', async (req, res) => {
  const { url } = req.body;
  const transcript = await whisper.transcribeYouTube(url);
  res.json({ transcript });
});

app.post('/generate-quiz', async (req, res) => {
  const { transcript, count } = req.body;
  const quizData = await quiz.generate(transcript, count);
  res.json({ quiz: quizData });
});

app.listen(5000, () => console.log('Server running on port 5000'));
