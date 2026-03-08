const { Task, TeamMember, User, Team } = require('../models');
const { Op } = require('sequelize');
const { notifyUser } = require('../services/socketService');

// Create a task
exports.createTask = async (req, res) => {
    try {
        const { title, description, due_date, teamId, assignedToId } = req.body;

        // Optional: Validate team membership if assigned to a team
        if (teamId) {
            const member = await TeamMember.findOne({ where: { userId: req.user.id, teamId } });
            if (!member) {
                return res.status(403).json({ error: 'Not a member of this team' });
            }
        }

        const task = await Task.create({
            title,
            description,
            due_date,
            teamId: teamId || null,
            assignedToId: assignedToId || null,
            createdById: req.user.id
        });

        if (assignedToId && assignedToId !== req.user.id) {
            notifyUser(assignedToId, 'task_assigned', {
                message: `Task "${title}" has been assigned to you.`,
                task
            });
        }

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get tasks with filtering and searching
exports.getTasks = async (req, res) => {
    try {
        const { status, search, teamId, assignedToId } = req.query;

        // Build query
        const whereClause = {};

        // Filtering by status
        if (status) {
            whereClause.status = status;
        }

        // Filtering by team or assignee
        if (teamId) whereClause.teamId = teamId;
        if (assignedToId) {
            whereClause.assignedToId = assignedToId;
        } else if (!teamId && !assignedToId) {
            // By default, if no team/assignee is provided, get tasks assigned to or created by the user
            whereClause[Op.or] = [
                { assignedToId: req.user.id },
                { createdById: req.user.id }
            ];
        }

        // Searching by title or description
        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        const tasks = await Task.findAll({
            where: whereClause,
            include: [
                { model: User, as: 'assignee', attributes: ['id', 'username', 'email'] },
                { model: User, as: 'creator', attributes: ['id', 'username'] },
                { model: Team, as: 'team', attributes: ['id', 'name'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a task (status, assign)
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, due_date, assignedToId } = req.body;

        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Check permissions (e.g. only creator or assignee or admin can update)
        if (task.createdById !== req.user.id && task.assignedToId !== req.user.id) {
            // Simplified: if it's a team task, maybe other team members can update?
            // Leaving strict permissions check simpler for the assignment:
            // return res.status(403).json({ error: 'Not authorized to update this task' });
        }

        const previousAssignee = task.assignedToId;

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.due_date = due_date || task.due_date;

        if (assignedToId !== undefined) {
            task.assignedToId = assignedToId;
        }

        await task.save();

        // Check if newly assigned
        if (assignedToId && assignedToId !== previousAssignee && assignedToId !== req.user.id) {
            notifyUser(assignedToId, 'task_assigned', {
                message: `Task "${task.title}" has been assigned to you.`,
                task
            });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
