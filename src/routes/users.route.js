const { Router } = require('express');
const { getUsers, createUser, deleteUserById, getUserById, updateUserById } = require('../controllers/users.controller');
const router = Router()

//Routes for books
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);



module.exports = router;