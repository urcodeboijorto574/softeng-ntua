const express = require('express');
const answerController = require(`${__dirname}/../controllers/answerController.js`);
const authController = require('./../controllers/authController.js');

const router = express.Router();

router
    .route('/:questionnaireID/:questionID/:session/:optionID')
    .post(
        authController.protect,
        authController.restrictTo('user'),
        answerController.doAnswer
    );

module.exports = router;
