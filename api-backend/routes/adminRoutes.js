const express = require('express');
const adminController = require(`${__dirname}/../controllers/adminController.js`);
const userController = require(`${__dirname}/../controllers/userController.js`);

const router = express.Router();

router
    .route('/healthcheck')
    .get(adminController.getHealthcheck);

router
    .route('/questionnaire_upd')
    .post(adminController.questionnaireUpdate);

router
    .route('/resetall')
    .post(adminController.resetAll);

router
    .route('/resetq/:questionnaireID')
    .post(adminController.resetQuestionnaire);

router
    .route('/usermod/:username/:password')
    .post(userController.userUpdate);

router
    .route('/users/:username')
    .get(userController.getUser);

module.exports = router;
