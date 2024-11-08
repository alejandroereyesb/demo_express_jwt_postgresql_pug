const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const queries = require('./queries');

async function createUser(username, password, email, role = 'user') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const values = [username, hashedPassword, email, role];
    
    const result = await pool.query(queries.createUser, values);
    return result.rows[0];
}

async function findUserByUsername(username) {
    const values = [username];
    const result = await pool.query(queries.findUserByUsername, values);
    return result.rows[0];
}

module.exports = { createUser, findUserByUsername };
