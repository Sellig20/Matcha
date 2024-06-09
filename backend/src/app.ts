const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
// const db = require("./db");
import { query } from './db';
import express, { Request, Response, NextFunction } from 'express';
import routes from './routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/apiExpress', (req: Request, res: Response) => {
  res.send(`Hello ${process.env.POSTGRES_DB}`);
});

app.get('/apiExpress/chat', (req: Request, res: Response) => {
  res.send('Chat page !');
});

// app.get('/apiExpress/users', async (req: Request, res: Response) => {
//   try {
//     const result = await query('SELECT * FROM public.userprofile');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Erreur du serveur pour extraction de la table UserProfile');
//   }
// });
app.use('/apiUsers', routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, () => console.log(`App running on port 3000.`));