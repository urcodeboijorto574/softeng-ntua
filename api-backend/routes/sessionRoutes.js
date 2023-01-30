const express = require('express');
const sessionController = require(`${__dirname}/../controllers/sessionController.js`);
const authController = require('./../controllers/authController.js');

const router = express.Router();

router
    .route('/getallsessions/:questionnaireID')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        sessionController.getAllSessions
    );

router
    .route('/sessionids')
    .get(
        authController.protect,
        authController.restrictTo('user'),
        sessionController.getAllSessionsIDs
    );

router
    .route('/getsession/:username/:questionnaireID')
    .get(
        authController.protect,
        authController.restrictTo('user'),
        sessionController.getSession
    );

module.exports = router;
