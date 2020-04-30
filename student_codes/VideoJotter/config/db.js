// Library to use MySQL to store session objects
const MySQLStore = require('express-mysql-session'); 

const db = require('./config/db'); // db.js config file

module.exports = {
    host: 'localhost',
    database: 'vidjot',
    username: 'itp211',
    password: 'itp211'
}

