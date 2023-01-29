const express = require('express');
const questionnaireController = require(`${__dirname}/../controllers/questionnaireController.js`);
const sessionController = require(`${__dirname}/../controllers/sessionController.js`);

const router = express.Router();

router
    .route('/getallquestionnaires')
    .get(questionnaireController.getAllQuestionnaires);

router
    .route('/userquestionnaires/:username')
    .get(questionnaireController.getUserQuestionnaires);

router
    .route('/:questionnaireID/getallsessions')
    .get(sessionController.getAllSessions);

router
    .route('/:questionnaireID')
    .get(questionnaireController.getQuestionnaire)
    .delete(questionnaireController.deleteQuestionnaire);

module.exports = router;
