const express = require('express');
const questionnaireController = require(`${__dirname}/../controllers/questionnaireController.js`);
const sessionController = require(`${__dirname}/../controllers/sessionController.js`);

const router = express.Router();

router
    .route('/getAllQuestionnaires')
    .get(questionnaireController.getAllQuestionnaires);

<<<<<<< HEAD
router.route('/:questionnaireID').get(questionnaireController.getQuestionnaire);
router
    .route('/:questionnaireID/getAllSessions')
    .get(questionnaireController.getAllSessions);
=======
router
    .route('/:questionnaireID/getAllSessions')
    .get(sessionController.getAllSessions);

router
    .route('/:questionnaireID')
    .get(questionnaireController.getQuestionnaire)
    .delete(questionnaireController.deleteQuestionnaire);
>>>>>>> origin/ioannis-branch

module.exports = router;
