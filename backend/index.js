import pg from 'pg';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/apiExpress', (req, res) => {
  res.send('Hello World!')
});

app.get('/apiExpress/chat', (req, res) => {
  res.send('Chat page !')
});

app.listen(3000, () => console.log(`App running on port 3000.`));
