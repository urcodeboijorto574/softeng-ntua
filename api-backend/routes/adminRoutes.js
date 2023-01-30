const express = require('express');
const adminController = require(`${__dirname}/../controllers/adminController.js`);
const authController = require('./../controllers/authController.js');

const router = express.Router();

router
    .route('/healthcheck')
    .get(
        authController.protect,
        authController.restrictTo('super-admin'),
        adminController.getHealthcheck
    );

router
    .route('/questionnaire_upd')
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        adminController.questionnaireUpdate
    );

router
    .route('/resetall')
    .post(
        authController.protect,
        authController.restrictTo('super-admin'),
        adminController.resetAll
    );

router
    .route('/resetq/:questionnaireID')
    .post(
        authController.protect,
        authController.restrictTo('super-admin'),
        adminController.resetAlladminController.resetQuestionnaire
    );

router
    .route('/:usermod/:username/:password')
    .post(
        authController.protect,
        authController.restrictTo('super-admin'),
        authController.createUser
    );

router
    .route('/users/:username')
    .get(
        authController.protect,
        authController.restrictTo('super-admin'),
        authController.getUser
    );

module.exports = router;
