const express = require('express');
const authController = require('../controllers/authController.js');

const router = express.Router();

router.route('/login').post(authController.login);

//router.route('/logout').post(authController.logout);
router.route('/signup').post(authController.signup);

module.exports = router;
