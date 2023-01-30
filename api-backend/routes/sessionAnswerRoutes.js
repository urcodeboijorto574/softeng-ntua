const express = require('express');
const answerController = require(`${__dirname}/../controllers/answerController.js`);

const router = express.Router();

// router
//     .route('/:questionnaireID/:session')
//     .get(answerController.getSessionAnswers);

module.exports = router;
