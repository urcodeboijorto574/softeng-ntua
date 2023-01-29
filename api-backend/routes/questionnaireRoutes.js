const express = require('express');
const questionnaireController = require('./../controllers/questionnaireController.js');
const authController = require('./../controllers/authController.js');

const router = express.Router();

/*     .route('/getAllQuestionnaires')
    .get(questionnaireController.getAllQuestionnaires); */

router
    .route('/:questionnaireID')
    .get(authController.protect, questionnaireController.getQuestionnaire);

module.exports = router;
