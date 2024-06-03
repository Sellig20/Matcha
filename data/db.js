require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.POSTGRES_DB,
  max: 20, //max 20 clients
  idleTimeoutMillis: 30000, //idle clients max 30 sec
  connectionTimeoutMillis: 2000, // timeout pour tentative de co de 2 sec
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}; //exporte la fonction "query" qui prend text=la requete SQL a executer et
//params=les valeurs a inserer dans la requete
//pool.query(text, params) est appelée pour 
//exécuter la requête SQL en utilisant la connexion du pool.