const express = require('express');
const questionnaireController = require('./../controllers/questionnaireController.js');

const router = express.Router();

router
    .route('/getAllQuestionnaires')
    .get(questionnaireController.getAllQuestionnaires);

router
    .route('/:questionnaireID')
    .get(questionnaireController.getQuestionnaire);

module.exports = router;
