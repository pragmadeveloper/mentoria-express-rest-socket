const User = require('../models/users.model');
const socketIO = require('../services/socket.service');
const bcrypt = require('bcrypt');

//Create user
const createUser = async (req, res) => {
  try {
    let body = req.body
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newUser = await User.create({...req.body, password:hashedPassword});
    if (newUser) {
      socketIO.emitEvent('User:created', newUser);
      return res.status(201).json({ message: 'user created successfully', data: newUser });
    } else {
      return res.status(400).json({ message: 'Error creating user', data: null });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user', error: error.message, data: null });
  }
}

//login user
const loginUser = async (req, res) => {
  try {
    let {email, password} = req.body
    const user = await User.findOne({
      where: { email: email }
    });
    if(!user){
      return res.status(400).json({ message: 'El email no está en base de datos', data: null });
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if(!matchPassword){
       return res.status(400).json({ message: 'Contraseña incorrecta', data: null });
    }
    return res.status(200).json({ message: 'usuario logueago', data: null });
  } catch (error) {
    return res.status(500).json({ message: 'Error login user', error: error.message, data: null });
  }
}

//get all Users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (users.length > 0) {
      return res.status(200).json({ message: 'Users retrieved successfully', data: users });
    } else {
      return res.status(404).json({ message: 'No users found', data: [] });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving users', error: error.message, data: null });
  }
}

//get user by id
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (user) {
      return res.status(200).json({ message: 'User retrieved successfully', data: user });
    } else {
      return res.status(404).json({ message: 'User not found', data: null });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving user', error: error.message, data: null });
  }

}

//update user by id
const updateUserById = async(req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await User.update(req.body, { where: { id } });
    if (updated) {
      const updatedUser = await User.findByPk(id);
      socketIO.emitEvent('User:updated', updatedUser);
      return res.status(200).json({ message: 'User updated successfully', data: updatedUser });
    } else {
      return res.status(404).json({ message: 'User not found', data: null });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user', error: error.message, data: null });
  }
}

//delete user by id
const deleteUserById= async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await User.destroy({ where: { id } });
    if (deleted) {
      socketIO.emitEvent('User:deleted', { id });
      return res.status(200).json({ message: 'User deleted successfully', data: null });
    } else {
      return res.status(404).json({ message: 'User not found', data: null });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user', error: error.message, data: null });
  }
}
module.exports = {
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    createUser,
    loginUser
};