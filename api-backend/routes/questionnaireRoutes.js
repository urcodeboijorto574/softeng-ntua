const express = require('express');
const questionnaireController = require(`${__dirname}/../controllers/questionnaireController.js`);
const sessionController = require(`${__dirname}/../controllers/sessionController.js`);
const authController = require('./../controllers/authController.js');

const router = express.Router();

router
    .route('/getallquestionnaires')
    .get(
        authController.protect,
        authController.restrictTo('user'),
        questionnaireController.getAllQuestionnaires
    );

router
    .route('/userquestionnaires/:username')
    .get(
        authController.protect,
        authController.restrictTo('user'),
        questionnaireController.getUserQuestionnaires
    );

router.route('/:questionnaireID/getallsessions').get(
    authController.protect,
    authController.restrictTo('admin'),
    //authController.restrictAdminByName,
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

module.exports = router;
