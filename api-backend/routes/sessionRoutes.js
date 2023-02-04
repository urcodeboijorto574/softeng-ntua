const express = require('express');
const sessionController = require(`${__dirname}/../controllers/sessionController.js`);
const authController = require('./../controllers/authController.js');

const router = express.Router();

router
    .route('/getallquestionnairesessions/:questionnaireID')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        sessionController.getAllQuestionnaireSessions
    );

router
    .route('/getallsessionsids')
    .get(
        authController.protect,
        authController.restrictTo('user'),
        sessionController.getAllSessionsIDs
    );

router
    .route('/getuserquestionnairesession/:questionnaireID')
    .get(
        authController.protect,
        authController.restrictTo('user'),
        sessionController.getUserQuestionnaireSession
    );

module.exports = router;
