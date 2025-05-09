const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', 
    password: 'santiago20', 
    database: 'memoriamedica',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function checkConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Conexión exitosa a la base de datos");
        connection.release();
    } catch (error) {
        console.error("❌ Conexión fallida:", error.message);
    }
}


checkConnection();

module.exports = pool;