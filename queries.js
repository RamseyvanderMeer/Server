const dotenv = require('dotenv');
const pg = require('pg');
const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());

dotenv.config();

var conString = process.env.db_URL;
var client = new pg.Client(conString);

async function connect() {
  try{
    await client.connect();
    console.log('connected')
  }
  catch (error){
    console.log(`failed to connect ${error}`);
  }
}

async function getEmails() {
  try{
    const results = await client.query('SELECT email FROM users ORDER BY id ASC');
    return results.rows;
  }
  catch (error){
    return [];
  }
}

async function getUsers() {
  try{
    const results = await client.query('SELECT * FROM users ORDER BY id ASC');
    return results.rows;
  }
  catch (error){
    return [];
  }
}

async function createUser(email, password){
  try{
    await client.query("insert into email (text) values ($1)", [email]);
    await client.query("insert into password (text) valuse ($1)", [password]);
    return true;
  }
  catch (error){
    console.error(error);
    return false;
  }
}

async function deleteUser(id) {
  try{
    await client.query("delete from users where id = $1", [id]);
    return true;
  }
  catch(error){
    return false;
  }
}

module.exports = {
  deleteUser,
  createUser,
  getUsers,
  getEmails,
  connect
};