const express = require('express');
const importController = require(`${__dirname}/../controllers/importController.js`);

const router = express.Router();

router
    .route('/import')
    .post(importController.importData);

router
    .route('/delete')
    .delete(importController.deleteData);

module.exports = router;
