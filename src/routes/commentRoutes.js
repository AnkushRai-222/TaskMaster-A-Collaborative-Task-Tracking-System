const express = require('express');
const router = express.Router({ mergeParams: true }); // to access taskId from parent router
const { addComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middlewares/auth');

router.route('/')
    .post(protect, addComment)
    .get(protect, getComments);

module.exports = router;
