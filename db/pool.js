const {Pool} = require('pg')
require('dotenv').config()

module.exports = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST
})