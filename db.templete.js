// cnの中身を書き換え，ファイル名をdb.jsに変更する．

const options = {
  // initialization options;
};
const pgp = require("pg-promise")(options);

const cn = {
  host: 'localhost',
  port: 5432,
  database: 'my-database-name',
  user: 'user-name',
  password: 'user-password'
};

const db = pgp(cn);

module.exports = db;
