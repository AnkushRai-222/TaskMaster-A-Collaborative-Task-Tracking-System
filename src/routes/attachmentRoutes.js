const express = require('express');
const router = express.Router({ mergeParams: true });
const upload = require('../middlewares/upload');
const { uploadAttachment, getAttachments } = require('../controllers/attachmentController');
const { protect } = require('../middlewares/auth');

router.route('/')
    .post(protect, upload.single('file'), uploadAttachment)
    .get(protect, getAttachments);

module.exports = router;
