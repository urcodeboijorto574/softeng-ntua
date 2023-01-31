const express = require('express');
const answerController = require(`${__dirname}/../controllers/answerController.js`);
const authController = require('./../controllers/authController.js');

const router = express.Router();

router
    .route('/:questionnaireID/:session')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        answerController.getSessionAnswers
    );

module.exports = router;
