const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "2109",
    database: "event_list",
    host: "localhost",
    port: 5432
});

module.exports = pool;