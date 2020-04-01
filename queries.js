//add client.end();

const dotenv = require('dotenv');
const pg = require('pg');

dotenv.config();

var conString = process.env.db_URL;
var client = new pg.Client(conString);

const getEmails = (request, response) => {
  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }

    const queryEmails = {
      text: 'SELECT email FROM users ORDER BY id ASC',
      rowMode: 'array'
    };

    client.query(queryEmails, (error, results)=> {
      if (error) {
        throw error;
      } else {
      const data = results.rows;
      console.log(data);
      // const dataArray = Object.keys(data);
      // const index = dataArray.indexOf('user@example.com');
      // console.log(Array.from(data));
      // console.log(index);
      return console.log(JSON.stringify(data));
      }
    });
  });
}

module.exports = {
    getEmails,
    // getPassword,
    // getType,
    // getUsers
};