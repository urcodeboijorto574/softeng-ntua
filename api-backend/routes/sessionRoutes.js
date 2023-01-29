const express = require('express');
const sessionController = require(`${__dirname}/../controllers/sessionController.js`);

const router = express.Router();

router
    .route('/getallsessions/:questionnaireID')
    .get(sessionController.getAllSessions);

router
    .route('/sessionids')
    .get(sessionController.getAllSessionsIDs);

module.exports = router;
