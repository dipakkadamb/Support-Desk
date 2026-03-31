const express = require('express');
const { getAllUsers, createEmployee, deleteUser } = require('../controllers/userController');
const { auth, isAdmin } = require('../middleware/auth');
const router = express.Router();

// All employee management routes are protected and restricted to Admins
router.get('/', auth, isAdmin, getAllUsers);
router.post('/register', auth, isAdmin, createEmployee);
router.delete('/:id', auth, isAdmin, deleteUser);

module.exports = router;
