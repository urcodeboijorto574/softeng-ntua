const express = require('express');
const sessionController = require(`${__dirname}/../controllers/sessionController.js`);
const authController = require('./../controllers/authController.js');

const router = express.Router();

router
    .route('/getallsessions/:questionnaireID')
    .get(sessionController.getAllSessions);

router.route('/sessionids').get(sessionController.getAllSessionsIDs);

router
    .route('/getsession/:username/:questionnaireID')
    .get(sessionController.getSession);

module.exports = router;
