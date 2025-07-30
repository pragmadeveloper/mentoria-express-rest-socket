const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const Book = sequelize.define('Book', {
  id: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
  title: {type: DataTypes.STRING,allowNull: false},
  author: {type: DataTypes.STRING,allowNull: false},
  year: {type: DataTypes.INTEGER,allowNull: false},
}, {
  // Opciones del modelo
  tableName: 'books' // Nombre de la tabla en la base de datos
});

module.exports = Book;
