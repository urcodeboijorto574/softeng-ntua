const express = require('express');
const questionnaireController = require(`${__dirname}/../controllers/questionnaireController.js`);
const sessionController = require(`${__dirname}/../controllers/sessionController.js`);
const authController = require(`${__dirname}/../controllers/authController.js`);

const router = express.Router();

router
    .route('/getadmincreatedquestionnaires')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        questionnaireController.getAdminCreatedQuestionnaires
    );

router
    .route('/getuseransweredquestionnaires')
    .get(
        authController.protect,
        authController.restrictTo('user'),
        questionnaireController.getUserAnsweredQuestionnaires
    );

router
    .route('/getusernotansweredquestionnaires')
    .get(
        authController.protect,
        authController.restrictTo('user'),
        questionnaireController.getUserNotAnsweredQuestionnaires
    );

router
    .route('/deletequestionnaire/:questionnaireID')
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'super-admin'),
        questionnaireController.deleteQuestionnaire
    );

router
    .route('/:questionnaireID')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        questionnaireController.getQuestionnaire
    );

module.exports = router;
