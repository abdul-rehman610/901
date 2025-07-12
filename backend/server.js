
const express = require('express');
const app = express();
const port = 5000;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AI Teacher Quiz Backend Running');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
