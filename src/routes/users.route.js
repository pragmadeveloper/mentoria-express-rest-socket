const { Router } = require('express');
const { getUsers, deleteUserById, getUserById, updateUserById, createUser, loginUser } = require('../controllers/users.controller');
const router = Router()

//Routes for users
router.post('/', createUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);



module.exports = router;