const { Pool } = require('pg');
// const pool = new Pool({
//     user: process.env.DB_USER,      
//     password: process.env.DB_PASSWORD,  
//     host: process.env.DB_HOST,      
//     port: process.env.DB_PORT,      
//     database: process.env.DB_NAME   
// });

// module.exports = {
//     query: (text, params) => pool.query(text, params) 
// };
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


module.exports = {
    query: (text, params) => pool.query(text, params)
};
