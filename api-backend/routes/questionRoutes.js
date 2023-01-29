const express = require('express');
const questionController = require(`${__dirname}/../controllers/questionController.js`);
const authController = require('./../controllers/authController.js');

const router = express.Router();

router
    .route('/:questionnaireID/:questionID')
    .get(questionController.getQuestion);

module.exports = router;
