const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
// const db = require("./db");
import { query } from './db';
import express, { Request, Response, NextFunction } from 'express';
import routes from './routes';
import createHttpError from 'http-errors';
// import  isHttpError  from 'http-errors';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/apiExpress/users', async (req: Request, res: Response) => {
//   try {
//     const result = await query('SELECT * FROM public.userprofile');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Erreur du serveur pour extraction de la table UserProfile');
//   }
// });

app.use('/apiServeur', routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// app.use('/api/auth', routes);
// app.use((req, res, next) => {
//   next(createHttpError(404,"Endpoint not found"));
// });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
//   console.error(error);
//   let errorMessage = "Unknown error";
//   let statusCode = 500;
  // if (isHttpError(error)) {
  //     statusCode = error.status;
  //     errorMessage = error.message;
  // }
//   res.status(statusCode).json({ error: errorMessage });
// })

app.listen(3000, () => console.log(`App running on port 3000.`));
function isHttpError(error: unknown) {
  throw new Error('Function not implemented.');
}

