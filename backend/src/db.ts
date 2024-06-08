// import dotenv from 'dotenv';
import { Pool, PoolClient, QueryResult } from 'pg';
import dotenv from 'dotenv';

// require('dotenv').config()
dotenv.config();

// var pg = require('pg');
// import pkg from 'pg';
// const { Pool } = pg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: 'host.docker.internal',
  database: process.env.POSTGRES_DB,
  port: 5432,
  max: 20, //max 20 clients
  idleTimeoutMillis: 30000, //idle clients max 30 sec
  connectionTimeoutMillis: 2000, // timeout pour tentative de co de 2 sec
});

pool.on('connect', (client: PoolClient) => {
  client.query('SET search_path TO UserProfile');
});

export const query = (text: string, params?: any[]): Promise<QueryResult<any>> => {
  return pool.query(text, params);
};
// export const query = (text, params) => pool.query(text, params);
// module.exports = {
//   query: (text, params) => pool.query(text, params),
// }; //exporte la fonction "query" qui prend text=la requete SQL a executer et
//params=les valeurs a inserer dans la requete
//pool.query(text, params) est appelée pour 
//exécuter la requête SQL en utilisant la connexion du pool.