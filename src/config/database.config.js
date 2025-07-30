require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // Desactiva el logging de SQL en la consola (puedes activarlo para depuración)
    dialectOptions: {
      ssl: {
        require: true, // Esto indica que se requiere una conexión SSL
        // ¡CUIDADO! Deshabilita la verificación del certificado del servidor.
        // NO USAR EN PRODUCCIÓN a menos que sea estrictamente necesario y entiendas los riesgos.
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;