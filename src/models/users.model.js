const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.config');

const User = sequelize.define('User', {
  id: {type: DataTypes.INTEGER,autoIncrement: true,primaryKey: true},
  name: {type: DataTypes.STRING,allowNull: false},
  password: {type: DataTypes.STRING,allowNull: false},
  email: {type: DataTypes.STRING,allowNull: false,unique: true,validate: {isEmail: true},},
  rol: {type: DataTypes.STRING,allowNull: false},
  address: {type: DataTypes.STRING,allowNull: true},
}, {
  // Opciones del modelo
  tableName: 'users' // Nombre de la tabla en la base de datos
});

module.exports = User;