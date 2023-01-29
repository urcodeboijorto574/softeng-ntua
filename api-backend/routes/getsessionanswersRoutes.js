const express = require('express');
const getsessionanswersController = require(`${__dirname}/../controllers/getsessionanswersController.js`);

const router = express.Router();

router
    .route('/:questionnaireID/:session')
    .get(getsessionanswersController.getAnswers);

module.exports = router;
