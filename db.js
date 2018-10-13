const options = {
  // initialization options;
};

const pgp = require("pg-promise")(options);
const db = pgp("postgres://naoki@localhost:5432/gtfs-okayama");

module.exports = db;
