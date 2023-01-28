const express = require('express');
const sessionController = require(`${__dirname}/../controllers/sessionController.js`);

const router = express.Router();

router
    .route('/getallsessions')
    .get(sessionController.getAllSessions);

router
    .route('/:sessionID')
    .get(sessionController.getAllSessionsIDs);

module.exports = router;
