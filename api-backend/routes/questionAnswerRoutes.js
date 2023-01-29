const express = require('express');
const answerController = require(`${__dirname}/../controllers/answerController.js`);

const router = express.Router();

router
    .route('/:questionnaireID/:questionID')
    .get(answerController.getQuestionAnswers);

module.exports = router;
