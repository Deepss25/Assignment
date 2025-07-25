
const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');

router.get('/:customer_id/overview', controller.getOverview);

module.exports = router;
