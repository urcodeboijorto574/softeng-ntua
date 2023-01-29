const express = require('express');

const superAdminController = require('../controllers/superAdminController');

const router = express.Router();

router.route('/healthcheck').get(superAdminController.gethealthcheck);

router.route('/resetall').post(superAdminController.doresetall);

router.route('/resetq/:id').post(superAdminController.resetQuestionnaire);

module.exports = router;
