const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration =  new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

module.exports = {
  generate: async (text, count) => {
    const prompt = `Create ${count} multiple-choice questions with 4 options each from the following text. Also, mention the correct answer:\n\n${text}`;
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });
    const content = response.data.choices[0].message.content;
    return [{ question: 'Sample Question?', options: ['A', 'B', 'C', 'D'], answer: 'A' }];
  }
};
