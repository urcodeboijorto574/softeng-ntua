const express = require('express');
const answerController = require(`${__dirname}/../controllers/answerController.js`);
const authController = require('./../controllers/authController.js');

const router = express.Router();

<<<<<<< HEAD
// endpoint must be restricted only to admins that have created the certain questionnaire with the given questionnaireID
=======
// endpoint must be rstreicted olnly to admins that have created the certain questionnaire with the given questionnaireID
>>>>>>> 67b90ccee6ff57922ec81f856976878efe92ba5c
router
    .route('/:questionnaireID/:questionID')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        answerController.getQuestionAnswers
    );

module.exports = router;
