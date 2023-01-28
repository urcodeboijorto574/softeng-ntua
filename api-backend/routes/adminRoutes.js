const express = require('express');
const adminController = require('./../controllers/adminController.js');
const authController = require('./../controllers/authController.js');

const router = express.Router();

router.route('/healthcheck').get(adminController.getHealthcheck);

router.route('/:usermod/:username/:password').post(authController.createUser);
//router.route('/users/:username').get(authController.getUser);

// router
//     .route('/questionnaire_upd')
//     .post(
//         adminController.storeOptionsFromQuestion,
//         adminController.storeQuestionsFromQuestionnaire,
//         adminController.createQuestionnaire
//     );

// router.route('/resetall').delete(adminController.resetAll);

module.exports = router;
