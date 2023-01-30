const express = require('express');
const questionnaireController = require(`${__dirname}/../controllers/questionnaireController.js`);
const sessionController = require(`${__dirname}/../controllers/sessionController.js`);
const authController = require('./../controllers/authController.js');

const router = express.Router();

router
    .route('/getallquestionnaires')
    .get(
        authController.protect,
<<<<<<< HEAD
        authController.restrictTo('user', 'admin'),
=======
        authController.restrictTo('user'),
>>>>>>> 67b90ccee6ff57922ec81f856976878efe92ba5c
        questionnaireController.getAllQuestionnaires
    );

router
    .route('/userquestionnaires/:username')
    .get(
        authController.protect,
        authController.restrictTo('user'),
        questionnaireController.getUserQuestionnaires
    );

<<<<<<< HEAD
router
    .route('/:questionnaireID/getallsessions')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        sessionController.getAllSessions
    );
=======
router.route('/:questionnaireID/getallsessions').get(
    authController.protect,
    authController.restrictTo('admin'),
    //authController.restrictAdminByName,
    sessionController.getAllSessions
);
>>>>>>> 67b90ccee6ff57922ec81f856976878efe92ba5c

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
