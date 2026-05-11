const mysql = require('mysql2/promise');

async function testConnection() {
    console.log('Testing MySQL connection...');
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Papi1234',
            database: 'smart_wash_hub'
        });
        console.log('Successfully connected to MySQL database!');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error connecting to MySQL database:', error);
        process.exit(1);
    }
}

testConnection();
