const express = require('express');
const questionnaireController = require(`${__dirname}/../controllers/questionnaireController.js`);
const sessionController = require(`${__dirname}/../controllers/sessionController.js`);
const authController = require('./../controllers/authController.js');

const router = express.Router();

router
    .route('/getallquestionnaires')
    .get(
        authController.protect,
        authController.restrictTo('user', 'admin'),
        questionnaireController.getQuestionnaire
    );

router
    .route('/userquestionnaires/:username')
    .get(
        authController.protect,
        authController.restrictTo('user'),
        questionnaireController.getUserAnsweredQuestionnaires
    );

router
    .route('/:questionnaireID/getallsessions')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        sessionController.getAllSessions
    );

// getQuestionnaire and deleteQuestionnaire must be restricted only to admins that have created the questionnaire
router
    .route('/:questionnaireID')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        questionnaireController.getQuestionnaire
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        questionnaireController.deleteQuestionnaire
    );

router
    .route('/userquestionnaires')
    .get(questionnaireController.getUserQuestionnaires);

module.exports = router;
