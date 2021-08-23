const mysql = require("mysql");
function queryTestDb(query, config) {
  // creates a new mysql connection using credentials from cypress.json env's
  const connection = mysql.createConnection({
    database: "multigaming",
  });
  // start connection to db
  connection.connect();
  // exec query + disconnect to db as a Promise
  return new Promise((resolve, reject) => {
    const query = "select * from Account where id = 1;";
    connection.query(query, (error, results) => {
      if (error) reject(error);
      else {
        connection.end();
        console.log(results);
        return resolve(results);
      }
    });
  });
}

function queryTestDb(query, config) {
  // creates a new mysql connection using credentials from cypress.json env's

  const connection = mysql.createConnection(config.env.dbgc);

  // start connection to db

  connection.connect();

  // exec query + disconnect to db as a Promise

  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) reject(error);
      else {
        connection.end();

        // console.log(results)

        return resolve(results);
      }
    });
  });
}

const allureWriter = require("@shelex/cypress-allure-plugin/writer");
module.exports = (on, config) => {
  // Usage: cy.task('queryDb', query)

  on("task", {
    executaBanco: (query) => {
      return queryTestDb(query, config);
    },
  });
  allureWriter(on, config);
  return config;
};
