const express = require('express');
const multer = require('multer');
const adminController = require(`${__dirname}/../controllers/adminController.js`);
const authController = require('./../controllers/authController.js');
const handleResponse =
    require(`${__dirname}/../utils/handleResponse.js`).handleResponse;

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../api-backend/files/'); //you tell where to upload the files,
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...');
    },
});

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
        upload.single('file'),
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
        authController.restrictTo('super-admin', 'admin'),
        adminController.resetQuestionnaire
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

router
    .route('/users/deleteUser/:username')
    .delete(
        authController.protect,
        authController.restrictTo('super-admin'),
        adminController.deleteUser
    );

module.exports = router;
