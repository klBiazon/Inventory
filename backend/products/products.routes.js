const express = require('express');
const router = express.Router();

const controller = require('./products.controller');

router.get('', controller.getAll);
router.post('', controller.post);
router.delete('/:id', controller.delete);

module.exports = router;