// import express from 'express';
// import dotenv from 'dotenv';
// import db from './db.js';
// require("dotenv").config({path:'./.env'})
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
// console.log(`Hello ${process.env.POSTGRES_DB}`)
console.log(`POSTGRES_DB: ${process.env.POSTGRES_DB}`);
const express = require('express')
const db = require("./db");
// dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/apiExpress', (req, res) => {
  // res.send('Hello Worldddddd!');
  res.send(`Hello ${process.env.POSTGRES_DB}`)
});

app.get('/apiExpress/chat', (req, res) => {
  res.send('Chat page !')
});


app.get('/apiExpress/userprofile', (req, res) => {
  // const result = await db.query('select * from userprofile');
  res.send('UserProfile');
})

app.get('/apiExpress/users', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM public.userprofile');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur du serveur pour extraction de la table UserProfile');
  }
});

app.listen(3000, () => console.log(`App running on port 3000.`));