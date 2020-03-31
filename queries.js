const dotenv = require('dotenv');
const pg = require('pg');

dotenv.config();

var conString = process.env.db_URL;
var client = new pg.Client(conString);

const getUsers = (request, response) => {
  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    client.query('SELECT email FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  });
}

module.exports = {
    getUsers
};