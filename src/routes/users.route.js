const { Router } = require('express');
const { getUsers, deleteUserById, getUserById, updateUserById } = require('../controllers/users.controller');
const router = Router()

//Routes for users
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);



module.exports = router;