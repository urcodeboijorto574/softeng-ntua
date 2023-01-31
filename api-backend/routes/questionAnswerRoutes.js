const express = require('express');
const answerController = require(`${__dirname}/../controllers/answerController.js`);
const authController = require('./../controllers/authController.js');

const router = express.Router();

// endpoint must be restricted only to admins that have created the certain questionnaire with the given questionnaireID
router
    .route('/:questionnaireID/:questionID')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        answerController.getQuestionAnswers
    );

module.exports = router;
