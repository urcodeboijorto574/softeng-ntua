const express = require('express');
const dummyDataController = require(`${__dirname}/../controllers/dummyDataController.js`);
const authController = require(`${__dirname}/../controllers/authController.js`);

const router = express.Router();

router
    .route('/import')
    .post(
        authController.protect,
        authController.restrictTo('super-admin'),
        dummyDataController.importData
    );

router
    .route('/export')
    .get(
        authController.protect,
        authController.restrictTo('super-admin'),
        dummyDataController.exportData
    );

module.exports = router;
