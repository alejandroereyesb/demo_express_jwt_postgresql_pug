const bcrypt = require('bcryptjs');
const queries = require('./queries');
const { executeQuery } = require('../utils/dbUtils');

async function createUser(name, email, role="user", password) {
    console.log('Creating user with data:', { name, email, role,  password});
    
    if (!name || !email || !role|| !password) {
        throw new Error('Faltan argumentos obligatorios para crear el usuario');
    }
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const values = [name, hashedPassword, email, role];
    return await executeQuery(queries.createUser, values);
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

async function findUserByEmail(email) {
    try {
        const values = [email];
        return await executeQuery(queries.findUserByEmail, values);
    } catch (error) {
        console.error('Error finding user by email:', error.message);
        throw new Error('Error al buscar el usuario por correo electrónico');
    }
}

module.exports = { createUser, findUserByUsername, findUserByEmail };
