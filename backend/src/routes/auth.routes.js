const express = require('express');
const { registerValidation, loginValidation } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { register, login, getCurrentUser } = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', loginValidation, login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Private
 */
router.get('/me', authenticate, getCurrentUser);

module.exports = router;

