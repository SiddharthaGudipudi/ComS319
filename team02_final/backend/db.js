const mysql = require('mysql2')

const db = mysql.createConnection({
host: "127.0.0.1",
user: "isaaclo",
password: "pooPooP33P33",
database: "secoms319"
})

module.exports = db;
