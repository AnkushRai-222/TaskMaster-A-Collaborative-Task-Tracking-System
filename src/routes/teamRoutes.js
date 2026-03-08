const express = require('express');
const router = express.Router();
const { createTeam, inviteUser, getUserTeams } = require('../controllers/teamController');
const { protect } = require('../middlewares/auth');

router.route('/')
    .post(protect, createTeam)
    .get(protect, getUserTeams);

router.post('/:teamId/invite', protect, inviteUser);

module.exports = router;
