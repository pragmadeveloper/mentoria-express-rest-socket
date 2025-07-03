const users = require('../models/users.model');
const newUsers = users.users;
const socketIO = require('../services/socket.service');

//create user
const createUser= async (req, res) => {
  const { name, email, address, role  } = req.body;
  if ( !name || !email || !address || !role) {
      return res.status(400).json({ message: 'Todos los campos son requeridos: name, email, address, role' });
  }
  const newUser = {id: String(newUsers.length + 1),name, email, address, role};
  if(newUser){
      newUsers.push(newUser);
      socketIO.emitEvent('User:created', newUser);
      return res.status(201).json(newUsers); // 201 Created
  }else{
    return res.status(500).json({ message: 'Error al crear usuario' });
  }
}

//get all Users
const getUsers = async (req, res) => {
  if (!newUsers || newUsers.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios' });
  }else {
      return res.status(200).json(newUsers);
  }
}

//get user by id
const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = newUsers.find(b => b.id === id);
  if (user) {
      return res.status(200).json(user);
  } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
  }
}

//update user by id
const updateUserById = async(req, res) => {
  const { id } = req.params;
  const { name,email,address,role } = req.body;

  let userFound = false;
  newUsers.forEach(user => {
    if (user.id === id) {
      userFound = true;
      user.name = name || user.name;
      user.email = email || user.email;
      user.address = address || user.address;
      user.role = role || user.role;
    }
  });

  if (userFound) {
    const updatedUser = newUsers.find(b => b.id === id);
    socketIO.emitEvent('user:updated', updatedUser);
    return res.status(200).json(updatedUser);
  } else {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
}

//delete user by id
const deleteUserById= async (req, res) => {
  const { id } = req.params;
  const initialLength = newUsers.length;
  const deleteUsers = newUsers.filter(user => user.id !== id);

  if (deleteUsers.length < initialLength) {
    socketIO.emitEvent('User:deleted', { id });
    return res.status(200).json(deleteUsers);
  } else {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
}
module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById
};