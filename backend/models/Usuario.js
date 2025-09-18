const mysql = require('mysql2/promise');

class Usuario {
    static async findOne(condition) {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'petconnect'
        });

        try {
            const [rows] = await connection.execute(
                'SELECT * FROM usuarios WHERE email = ?',
                [condition.email]
            );
            await connection.end();
            return rows[0];
        } catch (error) {
            console.error('Error en findOne:', error);
            await connection.end();
            throw error;
        }
    }
}

module.exports = Usuario;