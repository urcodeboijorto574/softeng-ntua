const express = require('express');
const getquestionanswersController = require(`${__dirname}/../controllers/getquestionanswersController.js`);

const router = express.Router();

router
    .route('/:questionnaireID/:questionID')
    .get(getquestionanswersController.getAnswers);

module.exports = router;
