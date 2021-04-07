const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

module.exports = () => open({ driver: sqlite3.Database, filename: './database.sqlite' });