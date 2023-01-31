const express = require('express');
const importController = require(`${__dirname}/../controllers/importController.js`);
const authController = require('./../controllers/authController.js');

const router = express.Router();

router
    .route('/import')
    .post(
        authController.protect,
        authController.restrictTo('super-admin'),
        importController.importData
    );

router
    .route('/delete')
    .delete(
        authController.protect,
        authController.restrictTo('super-admin'),
        importController.deleteData
    );

module.exports = router;
