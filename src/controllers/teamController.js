const { Team, TeamMember, User } = require('../models');

exports.createTeam = async (req, res) => {
    try {
        const { name, description } = req.body;

        const team = await Team.create({ name, description });

        // Creator becomes admin of the team
        await TeamMember.create({
            userId: req.user.id,
            teamId: team.id,
            role: 'admin'
        });

        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.inviteUser = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { email } = req.body; // user to invite

        // Check if requester is admin of the team
        const requesterMember = await TeamMember.findOne({
            where: { userId: req.user.id, teamId }
        });

        // We can allow any member to invite (or restrict to admin)
        // For simplicity, we allow any member or restrict it based on assignment
        if (!requesterMember) {
            return res.status(403).json({ error: 'Not a member of this team' });
        }

        const userToInvite = await User.findOne({ where: { email } });
        if (!userToInvite) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingMember = await TeamMember.findOne({
            where: { userId: userToInvite.id, teamId }
        });

        if (existingMember) {
            return res.status(400).json({ error: 'User is already a member' });
        }

        await TeamMember.create({
            userId: userToInvite.id,
            teamId,
            role: 'member' // default role
        });

        res.status(200).json({ message: 'User added to team successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserTeams = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [{
                model: Team,
                as: 'teams',
                through: { attributes: ['role'] }
            }]
        });

        res.status(200).json(user.teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
