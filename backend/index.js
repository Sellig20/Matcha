import pg from 'pg';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/apiExpress', (req, res) => {
  res.send('Hello Worldddddd!')
});

app.get('/apiExpress/chat', (req, res) => {
  res.send('Chat page !')
});


app.get('/apiExpress/userprofile', (req, res) => {
  // const result = await db.query('select * from userprofile');
  res.send('userprofile');
})

app.get('/apiExpress/users', async (req, res) => {
  try {
    const result = await db.query('SELECT biography FROM userprofile');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur du serveur pour la table UserProfile');
  }
});

app.listen(3000, () => console.log(`App running on port 3000.`));