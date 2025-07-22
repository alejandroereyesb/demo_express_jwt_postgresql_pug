const bcrypt = require('bcryptjs');
const queries = require('./queries');
const { executeQuery } = require('../utils/dbUtils');

async function createUser(username, password, email, role = 'user') {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const values = [username, hashedPassword, email, role];
        return await executeQuery(queries.createUser, values);
    } catch (error) {
        console.error('Error creating user:', error.message);
        throw new Error('Error al crear el usuario');
    }
}

async function findUserByUsername(username) {
    try {
        const values = [username];
        return await executeQuery(queries.findUserByUsername, values);
    } catch (error) {
        console.error('Error finding user by username:', error.message);
        throw new Error('Error al buscar el usuario por nombre de usuario');
    }
}

module.exports = { createUser, findUserByUsername };
