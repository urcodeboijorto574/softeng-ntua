const express = require('express');
const doanswerController = require(`${__dirname}/../controllers/doanswerController.js`);

const router = express.Router();

router
    .route('/:questionnaireID/:questionID/:session/:optionID')
    .post(doanswerController.doAnswer);

module.exports = router;
