const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const multer  = require('multer')
const upload = multer()
const controller = require('./category.controller');

router.get('/', controller.getAll);
router.get('/:id', controller.get);
router.post('/', checkAuth, upload.none(), controller.post);
router.put('/:id', checkAuth, upload.none(), controller.put);
router.delete('/:id', checkAuth, controller.delete);

module.exports = router;