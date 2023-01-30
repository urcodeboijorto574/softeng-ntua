const express = require('express');
const questionController = require(`${__dirname}/../controllers/questionController.js`);
const authController = require('./../controllers/authController.js');

const router = express.Router();

router
    .route('/:questionnaireID/:questionID')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
<<<<<<< HEAD
=======
        authController.createUser,
>>>>>>> 67b90ccee6ff57922ec81f856976878efe92ba5c
        questionController.getQuestion
    );

module.exports = router;
