const queries = {
    createUser: `
        INSERT INTO users (username, password, email, role) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;
    `,
    
    findUserByUsername: `
        SELECT * FROM users 
        WHERE username = $1;
    `,

    findUserByEmail: `
        SELECT * FROM users 
        WHERE email = $1;
    `
};

module.exports = queries;
