import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'zanot',
  password: '1234',
  host: 'host.docker.internal',
  database: 'db',
  port: 5432,
  max: 20, //max 20 clients
  idleTimeoutMillis: 30000, //idle clients max 30 sec
  connectionTimeoutMillis: 2000, // timeout pour tentative de co de 2 sec
});

pool.on('connect', client => {
  client.query('SET search_path TO UserProfile');
});

export default {
  query: (text, params) => pool.query(text, params),
};
// export const query = (text, params) => pool.query(text, params);


// module.exports = {
//   query: (text, params) => pool.query(text, params),
// }; //exporte la fonction "query" qui prend text=la requete SQL a executer et
//params=les valeurs a inserer dans la requete
//pool.query(text, params) est appelée pour 
//exécuter la requête SQL en utilisant la connexion du pool.