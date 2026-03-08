const express = require('express');
const router = express.Router();
const { generateTaskDescription } = require('../controllers/aiController');
const { protect } = require('../middlewares/auth');

router.post('/generate-description', protect, generateTaskDescription);

module.exports = router;
