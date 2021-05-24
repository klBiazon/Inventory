const express = require('express');
const router = express.Router();

const controller = require('./user.controller');

router.get('/', controller.getAll);
router.get('/:id', controller.getUser);
router.post('/signup', controller.signup);
router.post('/login', controller.login);

module.exports = router;